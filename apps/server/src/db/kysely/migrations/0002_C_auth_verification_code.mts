import { Kysely, sql } from "kysely";

export const up = async (db: Kysely<any>): Promise<void> => {
    await db.schema
        .createType("auth_verification_code_type")
        .asEnum(["signup", "login", "reset_password", "email_change"])
        .execute();

    await db.schema
        .createTable("auth_verification_code")
        .addColumn("id", "varchar(26)", (col) => col.primaryKey())
        .addColumn("user_id", "varchar(26)", (col) =>
            col.references("user.id").notNull().onDelete("restrict")
        )
        .addColumn("code_hash", "text", (col) => col.notNull())
        .addColumn("type", sql`auth_verification_code_type`, (col) =>
            col.notNull()
        )
        .addColumn("used", "boolean", (col) => col.notNull().defaultTo(false))
        .addColumn("expires_at", "timestamptz", (col) => col.notNull())
        .addColumn("created_at", "timestamptz", (col) =>
            col.defaultTo(sql`NOW()`)
        )
        .execute();

    await db.schema
        .createIndex("idx_auth_verification_code_user_id")
        .on("auth_verification_code")
        .columns(["user_id", "type", "used"])
        .execute();

    await db.schema
        .createIndex("idx_auth_verification_code_expires_at")
        .on("auth_verification_code")
        .column("expires_at")
        .execute();
};
export const down = async (db: Kysely<any>): Promise<void> => {
    await db.schema.dropIndex("idx_auth_verification_code_user_id").execute();

    await db.schema
        .dropIndex("idx_auth_verification_code_expires_at")
        .execute();

    await db.schema.dropTable("auth_verification_code").execute();

    await db.schema.dropType("auth_verification_code_type").execute();
};

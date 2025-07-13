import { Kysely, sql } from "kysely";

export const up = async (db: Kysely<any>): Promise<void> => {
    await db.schema
        .createTable("user")
        .addColumn("id", "varchar(26)", (col) => col.primaryKey())
        .addColumn("name", "text", (col) => col.notNull())
        .addColumn("username", "text", (col) => col.notNull())
        .addColumn("email", "text", (col) => col.notNull())
        .addColumn("password", "text", (col) => col.notNull())
        .addColumn("is_active", "boolean", (col) => col.defaultTo(true))
        .addColumn("is_verified", "boolean", (col) => col.defaultTo(false))
        .addColumn("created_at", "timestamp", (col) =>
            col.defaultTo(sql`NOW()`)
        )
        .addColumn("updated_at", "timestamptz", (col) =>
            col.defaultTo(sql`NOW()`)
        )

        .execute();

    await db.schema
        .createIndex("idx_user_username")
        .on("user")
        .column("username")
        .execute();

    await db.schema
        .createIndex("idx_user_email")
        .on("user")
        .column("email")
        .execute();
};
export const down = async (db: Kysely<any>): Promise<void> => {
    await db.schema.dropIndex("idx_user_username").execute();
    await db.schema.dropIndex("idx_user_email").execute();
    await db.schema.dropTable("user").execute();
};

import { Kysely, sql } from "kysely";

export const up = async (db: Kysely<any>): Promise<void> => {
    await db.schema
        .createTable("wallet")
        .addColumn("id", "varchar(26)", (col) => col.primaryKey())
        .addColumn("title", "text", (col) => col.notNull())
        .addColumn("description", "text", (col) => col.notNull())

        .addColumn("created_at", "timestamptz", (col) =>
            col.notNull().defaultTo(sql`NOW()`)
        )
        .addColumn("updated_at", "timestamptz", (col) =>
            col.notNull().defaultTo(sql`NOW()`)
        )
        .addColumn("created_by", "varchar(26)", (col) =>
            col.references("user.id").notNull().onDelete("restrict")
        )
        .addColumn("updated_by", "varchar(26)", (col) =>
            col.references("user.id").notNull().onDelete("restrict")
        )
        .addColumn("archived_at", "timestamptz", (col) =>
            col.defaultTo(sql`NULL`)
        )
        .addColumn("archived_by", "varchar(26)", (col) =>
            col
                .references("user.id")
                .onDelete("restrict")
                .defaultTo(sql`NULL`)
        )
        .execute();

    await db.schema
        .createIndex("idx_wallet_id")
        .on("wallet")
        .column("id")
        .execute();
};
export const down = async (db: Kysely<any>): Promise<void> => {
    await db.schema.dropIndex("idx_wallet_id").execute();

    await db.schema.dropTable("wallet").execute();
};

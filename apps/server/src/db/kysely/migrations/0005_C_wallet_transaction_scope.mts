import { Kysely, sql } from "kysely";

export const up = async (db: Kysely<any>): Promise<void> => {
    await db.schema
        .createType("wallet_transaction_scope_type")
        .asEnum(["expense", "income", "transfer"])
        .execute();

    await db.schema
        .createTable("wallet_transaction_scope")
        .addColumn("id", "varchar(26)", (col) => col.primaryKey())
        .addColumn("wallet_id", "varchar(26)", (col) =>
            col.references("wallet.id").notNull().onDelete("restrict")
        )
        .addColumn("name", "text", (col) => col.notNull())
        .addColumn("description", "text")
        .addColumn("type", sql`wallet_transaction_scope_type`, (col) =>
            col.notNull()
        )
        .addColumn("parent_id", "varchar(26)", (col) =>
            col
                .references("wallet_expense_scope.id")
                .onDelete("restrict")
                .defaultTo(sql`NULL`)
        )
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
};
export const down = async (db: Kysely<any>): Promise<void> => {
    await db.schema.dropTable("wallet_transaction_scope").execute();

    await db.schema.dropType("wallet_transaction_scope_type").execute();
};

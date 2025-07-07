import { Kysely, PostgresDialect } from "kysely";
import { promises as fs } from "fs";
import * as path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { Migrator, FileMigrationProvider } from "kysely";
import pg, { Pool } from "pg";

import createPGPool from "../index.mjs";
// dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const upDown = process.argv.slice(-1)[0];

const db = new Kysely<any>({
    dialect: new PostgresDialect({
        pool: createPGPool(),
    }),
});

export const migrate = async (): Promise<void> => {
    const migrator = new Migrator({
        db: db,
        provider: new FileMigrationProvider({
            fs,
            path,
            migrationFolder: path.join(__dirname, "./migrations"),
        }),
    });

    if (upDown === "up") {
        var { error, results } = await migrator.migrateToLatest();
    } else if (upDown === "down") {
        var { error, results } = await migrator.migrateDown();
    } else {
        throw new Error("\n\n\nERROR: migration must be 'up' or 'down'\n\n\n");
    }

    const migrationResults: {
        Migration: string;
        Status: string;
    }[] = [];

    results?.forEach((it) => {
        if (it.status === "Success") {
            migrationResults.push({
                Migration: it.migrationName,
                Status: "✅ Success",
            });
        } else if (it.status === "Error") {
            migrationResults.push({
                Migration: it.migrationName,
                Status: "❌ Error",
            });
        }
    });

    const maxMigrationWidth = Math.max(
        ...migrationResults.map((it) => it.Migration.length),
        "Migration".length
    );
    const maxStatusWidth = Math.max(
        ...migrationResults.map((it) => it.Status.length),
        "Status".length
    );
    const header = `| ${"Migration".padEnd(maxMigrationWidth)} | ${"Status".padEnd(maxStatusWidth)} |`;
    const divider = `|${"-".repeat(maxMigrationWidth + 2)}|${"-".repeat(maxStatusWidth + 2)}|`;

    console.log(divider);
    console.log(header);
    console.log(divider);

    migrationResults.forEach((it) => {
        const row = `| ${it.Migration.padEnd(maxMigrationWidth)} | ${it.Status.padEnd(maxStatusWidth)} |`;
        console.log(row);
    });

    console.log(divider);

    if (error) {
        console.error("failed to migrate");
        console.error(error);
        process.exit(1);
    }
    if (error) {
        console.error("failed to migrate");
        console.error(error);
        process.exit(1);
    }
};

await (async () => {
    console.log("\n\n---------------MIGRATION START----------------\n\n");
    try {
        await migrate();
    } catch (error) {
        console.error(error);
    }
    console.log("\n\n---------------MIGRATION FINISH----------------\n\n");
    process.exit(0);
})();

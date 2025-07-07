import { Pool } from "pg";
// dotenv.config();

const createPGPool = (): Pool => {
    return new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });
};
export default createPGPool;

import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

// Use DATABASE_URL if available (for Neon/Cloud), otherwise fallback to local credentials
const db = new pg.Client({
  connectionString: process.env.DATABASE_URL || undefined,
  // Fallback local configuration if DATABASE_URL is missing
  host: process.env.DATABASE_URL ? undefined : process.env.DB_HOST,
  port: process.env.DATABASE_URL ? undefined : process.env.DB_PORT,
  user: process.env.DATABASE_URL ? undefined : process.env.DB_USER,
  password: process.env.DATABASE_URL ? undefined : process.env.DB_PASSWORD,
  database: process.env.DATABASE_URL ? undefined : process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false // Required for secure cloud connections like Neon
  }
});

db.connect()
  .then(() => console.log("✅ PostgreSQL Connected to Cloud (Neon)"))
  .catch((err) => console.log("❌ Database connection error:", err));

export default db;
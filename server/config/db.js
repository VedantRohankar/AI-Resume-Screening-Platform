import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

// Configure connection pool with automatic reconnection and idle socket cleanup
const db = new Pool({
  connectionString: process.env.DATABASE_URL || undefined,
  // Fallback local configuration if DATABASE_URL is missing
  host: process.env.DATABASE_URL ? undefined : process.env.DB_HOST,
  port: process.env.DATABASE_URL ? undefined : (process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432),
  user: process.env.DATABASE_URL ? undefined : process.env.DB_USER,
  password: process.env.DATABASE_URL ? undefined : process.env.DB_PASSWORD,
  database: process.env.DATABASE_URL ? undefined : process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false, // Required for secure cloud connections like Neon
  },
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Return an error if connection takes longer than 10s
});

// Catch errors on idle clients to prevent crashing the Node process when Neon drops idle sockets
db.on("error", (err) => {
  console.warn("⚠️ PostgreSQL Pool Notice: Idle client connection closed by serverless host (auto-recovering):", err.message);
});

// Verify initial connectivity
db.query("SELECT NOW()")
  .then(() => console.log("✅ PostgreSQL Connected to Cloud (Neon)"))
  .catch((err) => console.error("❌ Database connection error:", err.message));

export default db;
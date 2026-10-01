import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load environment variables from .env file.
dotenv.config();

const sqlHost = process.env.SQL_HOST;
const sqlDbName = process.env.SQL_DB_NAME;
const user = process.env.SQL_ADMIN_USER;
const password = process.env.SQL_ADMIN_PASSWORD;

if (!sqlHost) {
  console.warn("SQL_HOST is not set in environment variables yet.");
}
if (!sqlDbName) {
  console.warn("SQL_DB_NAME is not set in environment variables yet.");
}
if (!user) {
  console.warn("SQL_ADMIN_USER is not set in environment variables yet.");
}
if (!password) {
  console.warn("SQL_ADMIN_PASSWORD is not set in environment variables yet.");
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  schemaFilter: ["public"],
  dbCredentials: {
    host: sqlHost || "localhost",
    user: user || "postgres",
    password: password || "",
    database: sqlDbName || "postgres",
    ssl: false,
  },
  verbose: true,
});

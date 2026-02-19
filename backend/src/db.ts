import { Pool } from "pg";

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "tasktracker",
  password: "Harish@123",
  port: 5432,
});

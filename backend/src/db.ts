import { Pool } from "pg";

// export const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "tasktracker",
//   password: "Harish@123",
//   port: 5432,
// });

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

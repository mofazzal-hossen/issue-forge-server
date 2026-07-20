import {neon, } from "@neondatabase/serverless"
import config from "../config"

export const sql = neon(config.database_url)

//when i used pg that

// import { Pool } from "pg";

// export const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

const query = `
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;
`;

const values = ["Munna", "munna@gmail.com", "123456"];

const result = await Pool.query(query, values);

console.log(result.rows[0]);
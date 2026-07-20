import {neon, } from "@neondatabase/serverless"
import config from "../config"

export const sql = neon(config.database_url)

//when i used pg that

// import { Pool } from "pg";

// export const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });


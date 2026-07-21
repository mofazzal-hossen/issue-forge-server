import { neon, } from "@neondatabase/serverless"
import config from "../config"

export const sql = neon(config.database_url)

//when i used pg that



export const initDB = async () => {
    console.log("Data DB Connect ")
}
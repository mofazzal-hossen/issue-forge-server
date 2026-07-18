
import dotenv from 'dotenv'
import { env } from 'process'
dotenv.config()

const config={
    port:env.PORT,
    database_url:env.DATABASE_URL
}

export default config

import dotenv from 'dotenv'
import { env } from 'process'
dotenv.config()

const config={
    port:env.PORT as string,
    database_url:env.DATABASE_URL as string
}

export default config
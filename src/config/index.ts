
import dotenv from 'dotenv'
import { env } from 'process'
dotenv.config()

const config = {
    port: env.PORT as string,
    database_url: env.DATABASE_URL as string,
    node_env: env.NODE_ENV as string,
    access_secret:env.ACCESS_SECRET as string,
    refresh_secret:env.REFRESH_SECRET as string,

}

export default config
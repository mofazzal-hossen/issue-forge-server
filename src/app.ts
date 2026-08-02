import express, { type Request, type Response } from 'express'
import { initDB } from './db'
import { logger } from './middleware/logger'
import { globalErrorHandler } from './middleware/globalErrorHandler'
import authRoute from './api/routes/auth.route'
import cookieParser from "cookie-parser";

const app = express()
app.use(logger)
app.use(cookieParser())
app.use(express.json())

initDB()
app.get('/', (req:Request, res:Response) => {
  // throw Error ("Server Is Dying")
  res.send('Hello World!')
})

app.use("/auth",authRoute)
app.use(globalErrorHandler)
export default app
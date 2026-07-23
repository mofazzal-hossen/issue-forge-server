import express, { type Request, type Response } from 'express'
import { initDB } from './db'
import { logger } from './middleware/logger'
import { globalErrorHandler } from './middleware/globalErrorHandler'

const app = express()
app.use(logger)

initDB()
app.get('/', (req:Request, res:Response) => {
  // throw Error ("Server Is Dying")
  res.send('Hello World!')
})


app.use(globalErrorHandler)
export default app
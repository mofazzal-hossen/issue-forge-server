import express, { type Request, type Response } from 'express'
import { initDB } from './db'
import { logger } from './middleware/logger'

const app = express()
app.use(logger)

initDB()
app.get('/', (req:Request, res:Response) => {
  res.send('Hello World!')
})


export default app
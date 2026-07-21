import express, { type Request, type Response } from 'express'
import { initDB } from './db'


const app = express()
initDB()
app.get('/', (req:Request, res:Response) => {
  res.send('Hello World!')
})


export default app
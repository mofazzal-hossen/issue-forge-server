import type { NextFunction, Request, Response } from "express";
import  fs  from 'fs';





  export const logger = (req:Request, res:Response, next:NextFunction) => {
  const log = `[${new Date().toISOString()}] ${req.method} ${req.url}\n`;

  fs.appendFile("logger.txt", log, (err) => {
    if (err) {
      console.error("Failed to write log:", err);
    } else {
      console.log("Log saved successfully");
    }
  });

  next();
}

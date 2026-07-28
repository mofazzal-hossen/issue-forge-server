import type { NextFunction, Request, Response } from 'express'
import authService from '../service/auth.Service'
import { sendResponse } from '../../utils/sendResponse'


export const signup = async (req: Request, res: Response) => {
  const { name, email, password, age, role } = req.body;
  const user = await authService.createUser({ name, email, password, age, role });

  if (!user) {
    return sendResponse(res, { message: "Failed to create user", error: true }, 400);
  }

  sendResponse(res, { message: "User registered successfully", data: user }, 200);
};




//login
export const login = async (req: Request, res: Response) => {
  const { name, email, password, age, role } = req.body;
  const user = await authService.createUser({ name, email, password, age, role });

  if (!user) {
    return sendResponse(res, { message: "Failed to create user", error: true }, 400);
  }

  sendResponse(res, { message: "User registered successfully", data: user }, 200);
};
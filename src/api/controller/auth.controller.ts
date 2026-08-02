import type { NextFunction, Request, Response } from 'express'
import authService from '../service/auth.Service'
import { sendResponse } from '../../utils/sendResponse'
import { signToken } from '../../utils/jwt';



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
  const { email, password, } = req.body;
  const user = await authService.validateUser(email, password);

  if (!user) {
    sendResponse(res, { message: "invalid email and user", }, 401);
    return
  }

  const { accessToken, refreshToken } = signToken(user)

  res.cookie('refreshCookie', refreshToken, {
    sameSite: "lax",
    httpOnly: true,
    secure: false

  })

  const result = {
    user: user,
    accessToken,
    refreshToken
  }
  return sendResponse(res, { message: "user login successfully", data: result },)
};

export const refresh = (req: Request, res: Response) => {

  const refreshToken = req.signedCookies?.refreshToken
  if (!refreshToken) {
    return sendResponse(res, { message: 'refresh token not fund ' })
  }

}
//tack the refresh token , validate, user , access

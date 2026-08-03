import type { NextFunction, Request, Response } from 'express'
import authService from '../service/auth.Service'
import { sendResponse } from '../../utils/sendResponse'
import { signToken, verifyToken } from '../../utils/jwt';




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

  res.cookie('refreshToken', refreshToken, {
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






export const refresh = async(req: Request, res: Response) => {

  const refreshToken = req.cookies?.refreshToken
  if (!refreshToken) {
    return sendResponse(res, { message: 'refresh token not fund ' },401)
  }
  const payload = verifyToken(refreshToken, "refresh")
    if (!refreshToken) {
    return sendResponse(res, { message: 'invalid refresh token  ' },401)
  }
  // console.log(payload)

  const user = await authService.getUserById(payload.id) 
  // console.log(user)

  if (!user) {
    return sendResponse(res,{ message: 'user not found',},404)
    
  }
  const { accessToken, refreshToken: newRefreshToken } = signToken(user);
  res.cookie("refreshToken",newRefreshToken,{
    secure:false,
    sameSite:'lax',
    httpOnly:true
  } )

  sendResponse(res,{
    message:"refresh token",data:{
      accessToken,
      newRefreshToken
    }
  })
}
//tack the refresh token , validate, user , access





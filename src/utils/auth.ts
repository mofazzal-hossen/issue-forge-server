import type { NextFunction, Request, Response } from "express";
import { sendResponse } from "./sendResponse";
import { verifyToken } from "./jwt";
import authService from "../api/service/auth.Service";
import type { role } from "../types";




const auth = async (req: Request, res: Response, next: NextFunction) => {
    const Token = req.headers.authorization

    if (!Token) {
        return sendResponse(res, { message: 'token not fund ' }, 401)
    };

    const payload = verifyToken(Token, "refresh")
    if (!payload) {
        return sendResponse(res, { message: 'invalid refresh token  ' }, 401)
    }
    const user = await authService.getUserById(payload.id)

    if (!user) {
        return sendResponse(res, { message: 'user not found', }, 404)

    }
    req.user = user
    next()
}

export const authorizeRole = (...roles: role[]) => {

    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.send('unauthorize')

        }
        if (!roles.includes(req.user.role)) {
            return res.send("toy don't have permission")
        }
        return next()
    }
}
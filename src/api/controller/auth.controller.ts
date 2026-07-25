import type { Request, Response } from "express";
import authService from "../service/auth.Service";
import { sendResponse } from '../../utils/sendResponse';


export const signup = (req: Request, res: Response) => {
    const user = authService.createUser(req.body)
    if (!user) {
        sendResponse(res, { message: 'Failed to create user' }, 400)
    }

    sendResponse(res, { message: 'user cerate successfully', data: user }, 201)
}

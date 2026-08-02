import config from "../config";
import type { RUser } from "../types";
import jwt from 'jsonwebtoken'




const verifyToken = (token:string, type:"access"|"refresh")=>{
    const secret = type ==='access' ? config.access_secret :config.refresh_secret 
    const decode =jwt.verify(token, secret)
}

export const signToken= (payload: RUser & {id:number})=>{
const accessToken = jwt.sign(payload,config.access_secret,{
    expiresIn:'1d'
})

const refreshToken = jwt.sign(payload,config.refresh_secret,{
    expiresIn:'15d'
})



return {accessToken,refreshToken}

}

// console.log( signToken({age:123, email:"hohi@gmail.com", name: "rest", role:"admin"}))










//access token = data access 
// refreshToken = accessToken abr generate korba
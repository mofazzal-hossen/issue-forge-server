import config from "../config";
import type { RUser } from "../types";
import jwt from 'jsonwebtoken'

const singToken= (payload: RUser)=>{
const accessToken = jwt.sign(payload,config.access_secret,{
    expiresIn:'1d'
})
return accessToken

}

console.log( singToken({age:123, email:"hohi@gmail.com", name: "rest", role:"admin"}))










//access token = data access 
// refreshToken = accessToken abr generate korba
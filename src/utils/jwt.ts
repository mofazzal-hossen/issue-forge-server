import type { RUser } from "../types";
import jwt from 'jsonwebtoken'

const singToken= (payload: RUser)=>{
const accessToken = jwt.sign(payload,"super",{
    expiresIn:''
})


}











//access token = data access 
// refreshToken = accessToken abr generate korba
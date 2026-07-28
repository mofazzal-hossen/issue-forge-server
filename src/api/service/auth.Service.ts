

import bcrypt from "bcrypt"
import { sql } from "../../db";
import type { RUser } from "../../types";

class AuthService {
    async createUser(user: RUser & { password: string }) {
        const { name, email, age, role, password } = user;

        const passwordHash = await bcrypt.hash(password, 10);

        const res = await sql`
      INSERT INTO users (name, email, passwordHash, age, role)
      VALUES (
        ${name},
        ${email},
        ${passwordHash},
        ${age},
        COALESCE(${role}, 'user')
      )
       RETURNING id , name , age, role
    `;

        return res[0];
    };



};

export default new AuthService()


//validateUser 4->step 
//  Search for a user
//Whether a user exists
//Password verification
// Return without password


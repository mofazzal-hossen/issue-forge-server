

import bcrypt from "bcrypt"
import { sql } from "../../db";
import type { RUser } from "../../types";
import type { User } from "../../types";

class AuthService {
    async createUser(user: RUser & { password: string }) {
        const { name, email, age, role, password } = user;

        const passwordHash = await bcrypt.hash(password, 10);

        const res = await sql`
      INSERT INTO users (name, email, password_hash, age, role)
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

    async validateUser(email: string, password: string) {
        const res =await sql`
            SELECT * FROM users WHERE email = ${email}

        `
        if(!res.length){
            return null;
        };

        const {password_hash, ...user}= res[0] as User
        const isValid =await bcrypt.compare(password,password_hash)
        return isValid ? user : null
    }

 async getUserById(id: string) {
  const res = await sql`
    SELECT id, name, email, age, role
    FROM users
    WHERE id = ${id}
  `;

   return res[0] as RUser & { id: number };
}


};

export default new AuthService()


//validateUser 4->step 
//  Search for a user
//Whether a user exists
//Password verification
// Return without password


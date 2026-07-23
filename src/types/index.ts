


export const role = ["user", "admin", "super_admin"] as const 
type role = typeof role[number]

export type User = {
    id: number,
    name: string,
    email:string,
    passwordHash: string,
    age: number,
    role: role,
    createdAt: Date,
    updatedAt:Date
}

export type RUser = Omit<User, "id" | "passwordHash" |"createdAt" |"updatedAt" >


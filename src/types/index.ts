


export const role = ["user", "admin", "super_admin"] as const
export type role = typeof role[number]

export type User = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  age: number;
  role: role;
  created_at: Date;
  updated_at: Date;
};

export type RUser = Omit<
  User,
  "id" | "password_hash" | "created_at" | "updated_at"
>;


export type Order = {
  id: number;
  customer_id: number;
  quantity: number;
  food: string;
  price: number;
  created_at: Date;
  updated_at: Date;
};

// export type CreateOrder = Omit<
//   Order,
//   "id" | "createdAt" | "updatedAt"
// >;
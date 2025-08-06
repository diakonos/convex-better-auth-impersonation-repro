export interface UserProfile {
  _id: string;
  userId: string;
  email: string;
  role: "admin" | "user";
  _creationTime: number;
  updatedAt?: number;
}

export interface AuthUser {
  id: string;
  email: string;
  role: "admin" | "user";
}

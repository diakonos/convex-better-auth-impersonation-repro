"use client";

import React, { createContext, useContext } from "react";
import { authClient } from "./auth-client";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface User {
  id: string;
  email: string;
  role: "admin" | "user";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Get the current user from Better Auth
  const session = useQuery(api.auth.getCurrentUser);

  const user = session
    ? {
        id: session.userId,
        email: session.email || "",
        role: session.role || "user",
      }
    : null;

  const login = async (email: string, password: string) => {
    await authClient.signIn.email({
      email,
      password,
    });
  };

  const signup = async (email: string, password: string, name: string) => {
    await authClient.signUp.email({
      email,
      password,
      name,
    });
  };

  const logout = async () => {
    await authClient.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isLoading: false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

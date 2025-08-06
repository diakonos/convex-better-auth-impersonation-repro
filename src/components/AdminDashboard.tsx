"use client";

import { useAuth } from "@/lib/auth-context";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { UserList } from "./UserList";
import { ImpersonationStatus } from "./ImpersonationStatus";

export function AdminDashboard() {
  const { user } = useAuth();
  const userProfiles = useQuery(api.userProfiles.getAllUserProfiles);

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="text-gray-600">Manage users and their roles</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">{userProfiles?.length || 0}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900">Admin Users</h3>
          <p className="text-3xl font-bold text-green-600">
            {userProfiles?.filter((u) => u.role === "admin").length || 0}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-900">Regular Users</h3>
          <p className="text-3xl font-bold text-purple-600">
            {userProfiles?.filter((u) => u.role === "user").length || 0}
          </p>
        </div>
      </div>

      <ImpersonationStatus />

      <UserList
        users={(userProfiles || []).map((profile) => ({
          _id: profile._id,
          userId: profile._id,
          email: profile.email,
          role: profile.role,
          _creationTime: profile._creationTime,
          updatedAt: profile.updatedAt,
        }))}
      />
    </div>
  );
}

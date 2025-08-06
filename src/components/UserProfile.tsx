"use client";

import { useAuth } from "@/lib/auth-context";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function UserProfile() {
  const { user, logout } = useAuth();
  const userProfile = useQuery(api.userProfiles.getUserProfile, {
    userId: user?.id || "",
  });

  if (!user) {
    return null;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Logout
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <p className="mt-1 text-sm text-gray-900">{user.email}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <p className="mt-1 text-sm text-gray-900 capitalize">{user.role}</p>
        </div>

        {userProfile && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Created</label>
              <p className="mt-1 text-sm text-gray-900">{new Date(userProfile._creationTime).toLocaleDateString()}</p>
            </div>

            {userProfile.updatedAt && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                <p className="mt-1 text-sm text-gray-900">{new Date(userProfile.updatedAt).toLocaleDateString()}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

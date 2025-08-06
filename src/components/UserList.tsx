"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { UserProfile } from "../types";
import { ImpersonationControls } from "./ImpersonationControls";
import { authClient } from "@/lib/auth-client";
import { useAuth } from "@/lib/auth-context";

interface UserListProps {
  users: UserProfile[];
}

export function UserList({ users }: UserListProps) {
  const { user: currentUser } = useAuth();
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<"admin" | "user">("user");
  const [removingUser, setRemovingUser] = useState<string | null>(null);
  const updateUserRole = useMutation(api.userProfiles.updateUserRole);

  const handleEditRole = async (userId: string, currentRole: string) => {
    if (newRole && newRole !== currentRole) {
      try {
        await updateUserRole({ userId, role: newRole });
        setEditingUser(null);
        setNewRole("user");
      } catch (error) {
        console.error("Failed to update user role:", error);
      }
    }
  };

  const handleRemoveUser = async (userId: string) => {
    if (confirm("Are you sure you want to remove this user? This action cannot be undone.")) {
      setRemovingUser(userId);
      try {
        const { error } = await authClient.admin.removeUser({ userId });
        if (error) {
          console.error("Failed to remove user:", error);
          alert("Failed to remove user. Please try again.");
        } else {
          // The user list will be refreshed automatically by the query
          alert("User removed successfully.");
        }
      } catch (error) {
        console.error("Failed to remove user:", error);
        alert("Failed to remove user. Please try again.");
      } finally {
        setRemovingUser(null);
      }
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">User Management</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">View and manage user accounts</p>
      </div>
      <ul className="divide-y divide-gray-200">
        {users.map((user) => {
          const isCurrentUser = currentUser?.id === user.userId;

          return (
            <li key={user._id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">{user.email.charAt(0).toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {user.email}
                      {isCurrentUser && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          You
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      Created: {new Date(user._creationTime).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {editingUser === user.userId ? (
                    <div className="flex items-center space-x-2">
                      <select
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value as "admin" | "user")}
                        className="text-sm border border-gray-300 rounded-md px-2 py-1"
                      >
                        <option value="">Select role</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button
                        onClick={() => handleEditRole(user.userId, user.role)}
                        className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingUser(null);
                          setNewRole("user");
                        }}
                        className="text-sm bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.role}
                      </span>
                      {!isCurrentUser && (
                        <button
                          onClick={() => {
                            setEditingUser(user.userId);
                            setNewRole(user.role);
                          }}
                          className="text-sm text-blue-600 hover:text-blue-900"
                        >
                          Edit Role
                        </button>
                      )}
                      {!isCurrentUser && (
                        <>
                          <ImpersonationControls targetUserId={user.userId} targetUserEmail={user.email} />
                          <button
                            onClick={() => handleRemoveUser(user.userId)}
                            disabled={removingUser === user.userId}
                            className="text-sm text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {removingUser === user.userId ? "Removing..." : "Remove"}
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

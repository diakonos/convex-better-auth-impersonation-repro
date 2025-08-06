"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserProfile } from "@/components/UserProfile";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">Admin User Management</h1>
              </div>
              <div className="flex items-center space-x-4">
                <NavLinks />
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <UserProfile />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

function NavLinks() {
  const { user } = useAuth();

  return (
    <>
      <Link href="/" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
        Home
      </Link>
      {user?.role === "admin" && (
        <Link href="/admin" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
          Admin Dashboard
        </Link>
      )}
    </>
  );
}

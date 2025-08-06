"use client";

import { useAuth } from "@/lib/auth-context";
import { authClient } from "@/lib/auth-client";
import { useState, useEffect } from "react";

interface ImpersonatedUser {
  email: string;
  name?: string;
}

export function ImpersonationStatus() {
  const { user } = useAuth();
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [impersonatedUser, setImpersonatedUser] = useState<ImpersonatedUser | null>(null);

  // Check if current session is being impersonated
  useEffect(() => {
    const checkImpersonationStatus = async () => {
      try {
        // We can check the current session to see if it's being impersonated
        // This would typically be done by checking the session data
        // For now, we'll use a simple approach
        const session = await authClient.getSession();
        // Note: The session type might not include impersonatedBy yet
        // This is a simplified check - in a real implementation you'd check the session metadata
        if (session && "impersonatedBy" in session) {
          setIsImpersonating(true);
          // You could fetch the admin user details here
        } else {
          setIsImpersonating(false);
        }
      } catch (error) {
        console.error("Error checking impersonation status:", error);
      }
    };

    checkImpersonationStatus();
  }, []);

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Impersonation Status</h3>

      {/* Active Impersonation Session */}
      {isImpersonating && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-yellow-800">Currently Impersonating</h4>
              <p className="text-sm text-yellow-700">{impersonatedUser?.email || "Unknown user"}</p>
            </div>
            <div className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">ACTIVE</div>
          </div>
        </div>
      )}

      {/* Impersonation History */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">Admin Functions</h4>
        <p className="text-sm text-gray-500">
          Use the impersonation controls in the user list to start impersonating users. The Better Auth admin plugin
          handles session management automatically.
        </p>
      </div>

      {!isImpersonating && <p className="text-sm text-gray-500 mt-4">No active impersonation session.</p>}
    </div>
  );
}

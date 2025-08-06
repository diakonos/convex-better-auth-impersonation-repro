"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";

export function ImpersonationIndicator() {
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [impersonatedUser, setImpersonatedUser] = useState<string | null>(null);
  const [adminUser, setAdminUser] = useState<string | null>(null);

  useEffect(() => {
    const checkImpersonationStatus = async () => {
      try {
        const session = await authClient.getSession();
        // Check if current session is being impersonated
        if (session && "impersonatedBy" in session) {
          setIsImpersonating(true);
          // In a real implementation, you'd fetch the user details
          // For now, we'll use a placeholder
          setImpersonatedUser("User being impersonated");
          setAdminUser("Admin user"); // You'd fetch the actual admin user details
        } else {
          setIsImpersonating(false);
          setImpersonatedUser(null);
          setAdminUser(null);
        }
      } catch (error) {
        console.error("Error checking impersonation status:", error);
      }
    };

    checkImpersonationStatus();

    // Set up polling to check status periodically
    const interval = setInterval(checkImpersonationStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!isImpersonating) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg border border-yellow-600">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Impersonating: {impersonatedUser}</span>
        </div>
        <div className="text-xs mt-1 opacity-90">Started by: {adminUser}</div>
      </div>
    </div>
  );
}

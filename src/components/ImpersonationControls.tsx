"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { authClient } from "@/lib/auth-client";

interface ImpersonationControlsProps {
  targetUserId: string;
  targetUserEmail: string;
}

export function ImpersonationControls({ targetUserId, targetUserEmail }: ImpersonationControlsProps) {
  const { user } = useAuth();
  const [isStarting, setIsStarting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [isImpersonating, setIsImpersonating] = useState(false);

  // Check if currently impersonating this user
  useEffect(() => {
    const checkImpersonationStatus = async () => {
      try {
        const session = await authClient.getSession();
        // This is a simplified check - in a real implementation you'd check if the current session
        // is impersonating the specific target user
        if (session && "impersonatedBy" in session) {
          setIsImpersonating(true);
        } else {
          setIsImpersonating(false);
        }
      } catch (error) {
        console.error("Error checking impersonation status:", error);
      }
    };

    checkImpersonationStatus();
  }, [targetUserId]);

  const handleStartImpersonation = async () => {
    if (!user || user.role !== "admin") return;

    setIsStarting(true);
    try {
      const { data, error } = await authClient.admin.impersonateUser({
        userId: targetUserId,
      });

      if (error) {
        console.error("Failed to start impersonation:", error);
        alert("Failed to start impersonation");
      } else {
        // The admin plugin will handle the session switch automatically
        setIsImpersonating(true);
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Failed to start impersonation:", error);
      alert("Failed to start impersonation");
    } finally {
      setIsStarting(false);
    }
  };

  const handleStopImpersonation = async () => {
    setIsStopping(true);
    try {
      const { data, error } = await authClient.admin.stopImpersonating();

      if (error) {
        console.error("Failed to stop impersonation:", error);
        alert("Failed to stop impersonation");
      } else {
        setIsImpersonating(false);
      }
    } catch (error) {
      console.error("Failed to stop impersonation:", error);
      alert("Failed to stop impersonation");
    } finally {
      setIsStopping(false);
    }
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {isImpersonating ? (
        <button
          onClick={handleStopImpersonation}
          disabled={isStopping}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          {isStopping ? "Stopping..." : "Stop Impersonation"}
        </button>
      ) : (
        <button
          onClick={handleStartImpersonation}
          disabled={isStarting}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isStarting ? "Starting..." : "Impersonate"}
        </button>
      )}
    </div>
  );
}

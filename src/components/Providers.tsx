"use client";

import { ConvexClientProvider } from "@/lib/convex";
import { AuthProvider } from "@/lib/auth-context";
import { ImpersonationIndicator } from "./ImpersonationIndicator";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConvexClientProvider>
      <AuthProvider>
        {children}
        <ImpersonationIndicator />
      </AuthProvider>
    </ConvexClientProvider>
  );
}

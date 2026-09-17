import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

import { getCurrentUser } from "@/services/auth";
import { useAuthStore } from "@/store/auth-store";

export default function Index() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const logout = useAuthStore((state) => state.logout);

  const [checkingUser, setCheckingUser] = useState(true);
  const [currentUser, setCurrentUser] = useState<Awaited<
    ReturnType<typeof getCurrentUser>
  > | null>(null);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      setCheckingUser(false);
      return;
    }

    const checkCurrentUser = async () => {
      try {
        const me = await getCurrentUser();

        console.log("Current user:", me);

        setCurrentUser(me);
      } catch (error) {
        console.error("Failed to fetch current user:", error);

        // Token is invalid/expired.
        // Clear the stored session.
        await logout();
      } finally {
        setCheckingUser(false);
      }
    };

    checkCurrentUser();
  }, [isAuthenticated, isLoading, logout]);

  // Still restoring the SecureStore session.
  if (isLoading || checkingUser) {
    return null;
  }

  // Not authenticated.
  if (!isAuthenticated || !currentUser) {
    return <Redirect href="/(auth)/role-selection" />;
  }

  // --------------------------------
  // OWNER FLOW
  // --------------------------------
  if (currentUser.role === "owner") {
    return <Redirect href="/(owner)" />;
  }

  // --------------------------------
  // MEMBER FLOW
  // --------------------------------

  // Member has no active membership.
  if (currentUser.role === "member" && currentUser.membership === null) {
    return <Redirect href="/(auth)/join-gym" />;
  }

  // Member has an active membership.
  return <Redirect href="/(member)" />;
}

import { useEffect, useState } from "react";
import { Outlet } from "react-router";

export function AdminGuard() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // TEMPORARY BYPASS: Automatically authorize everyone as requested by user
    setAuthorized(true);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return authorized ? <Outlet /> : null;
}

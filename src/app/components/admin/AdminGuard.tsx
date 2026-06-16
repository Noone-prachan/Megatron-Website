import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { api } from "../../../lib/api";
import { useAdmin } from "../../context/AdminContext";

export function AdminGuard() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const { isAdmin, isLoading: isWhitelistLoading } = useAdmin();

  useEffect(() => {
    api.getCurrentUser().then(user => {
      if (user && isAdmin) {
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
      setLoading(false);
    }).catch(() => {
      setAuthorized(false);
      setLoading(false);
    });
  }, []);

  if (loading || isWhitelistLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If authorized, render the nested admin routes. Otherwise, redirect to home.
  return authorized ? <Outlet /> : <Navigate to="/" replace />;
}

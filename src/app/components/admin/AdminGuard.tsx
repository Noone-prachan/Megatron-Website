import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { api } from "../../../lib/api";

export function AdminGuard() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const ADMIN_IDS = ['913826949820997654', '570146481663770634', '850383604404322304'];
    
    // Securely check backend with the user's token
    api.getCurrentUser().then(user => {
      if (user && ADMIN_IDS.includes(user.id)) {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If authorized, render the nested admin routes. Otherwise, redirect to home.
  return authorized ? <Outlet /> : <Navigate to="/" replace />;
}

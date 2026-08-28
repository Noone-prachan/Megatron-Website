import { Outlet, Navigate } from "react-router-dom";

const ADMIN_IDS = ['570146481663770634', '850383604404322304'];

function getDiscordId(): string | null {
  const stored = localStorage.getItem('discord_id');
  if (stored) return stored;
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload?.id ? String(payload.id) : null;
  } catch {
    return null;
  }
}

export function AdminGuard() {
  const discordId = getDiscordId();
  const isAdmin = discordId ? ADMIN_IDS.includes(discordId) : false;

  if (!isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
}

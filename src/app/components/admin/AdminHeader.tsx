import { Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export function AdminHeader() {
  const { isDarkMode, toggleTheme } = useTheme();
  const discordId = localStorage.getItem("discord_id");
  const discordUsername = localStorage.getItem("discord_username");
  const discordGlobalName = localStorage.getItem("discord_global_name");
  const discordAvatar = localStorage.getItem("discord_avatar");

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("discord_id");
    localStorage.removeItem("discord_username");
    localStorage.removeItem("discord_global_name");
    localStorage.removeItem("discord_avatar");
    window.location.href = '/';
  };

  const avatarUrl = discordAvatar
    ? `https://cdn.discordapp.com/avatars/${discordId}/${discordAvatar}.png`
    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${discordId}`;

  return (
    <header className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)] p-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-lg">
        Back to Site
      </Link>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--nav-text)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-all shadow-md"
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <div className="flex items-center gap-3">
          <img src={avatarUrl} alt="avatar" className="w-10 h-10 rounded-full" />
          <div>
            <p className="font-bold">{discordGlobalName || discordUsername}</p>
            <button onClick={handleLogout} className="text-xs text-red-500">Logout</button>
          </div>
        </div>
      </div>
    </header>
  );
}
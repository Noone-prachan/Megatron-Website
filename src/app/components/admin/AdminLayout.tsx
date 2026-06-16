import { Outlet, NavLink, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, Clock, Megaphone, BarChart, Sun, Moon, ArrowLeft, Menu, Shield } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { Suspense, useState, useEffect } from "react";
import { GlobalLoader } from "../ui/GlobalLoader";

export function AdminLayout() {
  const { isDarkMode, toggleTheme } = useTheme();
  const discordId = localStorage.getItem("discord_id");
  const discordUsername = localStorage.getItem("discord_username");
  const discordGlobalName = localStorage.getItem("discord_global_name");
  const discordAvatar = localStorage.getItem("discord_avatar");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Close sidebar on navigation to a new page
    setSidebarOpen(false);
  }, [location.pathname]);

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

  const navItems = [
    { to: "/admin", label: "Analytics", icon: LayoutDashboard },
    { to: "/admin/products", label: "Products", icon: ShoppingCart },
    { to: "/admin/orders", label: "Orders", icon: BarChart },
    { to: "/admin/history", label: "History", icon: Clock },
    { to: "/admin/announcement", label: "Announcement", icon: Megaphone },
    { to: "/admin/security", label: "Security", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] p-6 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center gap-3 mb-8">
          <Link to="/">
            <img src="/images/megatronlogo.png" alt="Megatron Logo" className="h-10 w-auto object-contain" />
          </Link>
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg font-semibold transition-colors ${isActive
                  ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2 rounded-lg font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Site</span>
          </Link>
        </div>
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={avatarUrl} alt="avatar" className="w-10 h-10 rounded-full" />
              <p className="font-bold text-sm">{discordGlobalName || discordUsername}</p>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-sm bg-red-500/10 text-red-500 px-2 py-2 rounded-lg hover:bg-red-500/20 transition-colors font-semibold"
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="lg:pl-64">
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-[var(--bg-secondary)]/80 backdrop-blur-sm border-b border-[var(--border-color)] lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/admin" className="font-bold text-lg">
            Admin Panel
          </Link>
          <div className="w-10" /> {/* Spacer to balance the button */}
        </div>
        <div className="p-6">
          <Suspense fallback={<GlobalLoader />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
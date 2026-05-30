import { useState } from "react";
import { useAnnouncement } from "../../context/AnnouncementContext";
import { Megaphone, Save, Power } from "lucide-react";

export function AnnouncementManager() {
  const { isActive, setIsActive, text, setText, color, setColor, countdownTarget, setCountdownTarget } = useAnnouncement();
  
  // Local state for the form so we don't update context on every keystroke
  const [localText, setLocalText] = useState(text);
  const [localColor, setLocalColor] = useState(color);
  const [localDate, setLocalDate] = useState(() => {
    // Convert ISO string to format YYYY-MM-DDThh:mm required by input type="datetime-local"
    const d = new Date(countdownTarget);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setText(localText);
    setColor(localColor);
    setCountdownTarget(new Date(localDate).toISOString());
    alert("Announcement settings saved and applied to the site!");
  };

  const toggleActive = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black text-[var(--text-primary)]">Announcement Banner</h1>
        <p className="text-[var(--text-secondary)] mt-1">Manage the top announcement ticker and countdown timer.</p>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-8 shadow-sm">
        
        <div className="flex items-center justify-between mb-8 pb-8 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isActive ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Banner Status</h2>
              <p className="text-[var(--text-secondary)] text-sm">
                The banner is currently <span className={`font-bold ${isActive ? 'text-green-500' : 'text-red-500'}`}>{isActive ? "Visible" : "Hidden"}</span>
              </p>
            </div>
          </div>
          <button 
            onClick={toggleActive}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold shadow-md transition-all ${
              isActive 
                ? "bg-red-500 hover:bg-red-600 text-white" 
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            <Power className="w-4 h-4" />
            {isActive ? "Turn Off Banner" : "Turn On Banner"}
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Announcement Text</label>
            <input 
              type="text" 
              required 
              value={localText} 
              onChange={e => setLocalText(e.target.value)} 
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none" 
              placeholder="e.g. Flash Sale: 50% Off All Mythic Accounts!" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Countdown Target</label>
              <input 
                type="datetime-local" 
                required 
                value={localDate} 
                onChange={e => setLocalDate(e.target.value)} 
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Banner Background Color</label>
              <div className="flex items-center gap-4">
                <input 
                  type="color" 
                  value={localColor} 
                  onChange={e => setLocalColor(e.target.value)} 
                  className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0" 
                />
                <input 
                  type="text" 
                  value={localColor} 
                  onChange={e => setLocalColor(e.target.value)} 
                  className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none font-mono uppercase" 
                />
              </div>
            </div>
          </div>

          {/* Preview Box */}
          <div className="pt-4">
            <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Live Preview</label>
            <div 
              className="h-10 flex items-center overflow-hidden border border-black/20 rounded-lg relative"
              style={{ backgroundColor: localColor }}
            >
              <div className="flex items-center">
                <span className="text-xs font-bold uppercase tracking-widest px-4 text-[#fde047]">
                  {localText}
                </span>
                <span className="text-white font-mono text-xs font-bold bg-black/30 px-2 py-0.5 rounded mr-4">
                  01:23:45:12
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-[var(--border-color)]">
            <button type="submit" className="bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white px-8 py-3 rounded-xl font-bold transition-colors flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Settings
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

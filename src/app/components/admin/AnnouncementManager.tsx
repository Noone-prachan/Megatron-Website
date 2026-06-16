import { useState } from "react";
import { useAnnouncement } from "../../context/AnnouncementContext";
import { Megaphone, Save, Power, Star, Sparkles, Zap, Gift } from "lucide-react";
import { toast } from 'sonner';

export function AnnouncementManager() {
  const { 
    isActive, setIsActive, 
    text, setText, 
    color, setColor, 
    countdownTarget, setCountdownTarget,
    linkUrl, setLinkUrl,
    showTimer, setShowTimer,
    layoutMode, setLayoutMode,
    isGradient, setIsGradient,
    textColor, setTextColor,
    iconType, setIconType,
    bannerSize, setBannerSize,
    marqueeSpeed, setMarqueeSpeed,
    timerTheme, setTimerTheme
  } = useAnnouncement();
  
  // Local state for the form so we don't update context on every keystroke
  const [localText, setLocalText] = useState(text);
  const [localColor, setLocalColor] = useState(color);
  const [localLink, setLocalLink] = useState(linkUrl);
  const [localShowTimer, setLocalShowTimer] = useState(showTimer);
  const [localLayout, setLocalLayout] = useState(layoutMode);
  const [localGradient, setLocalGradient] = useState(isGradient);
  const [localTextColor, setLocalTextColor] = useState(textColor);
  const [localIcon, setLocalIcon] = useState(iconType);
  const [localSize, setLocalSize] = useState(bannerSize);
  const [localSpeed, setLocalSpeed] = useState(marqueeSpeed);
  const [localTheme, setLocalTheme] = useState(timerTheme);
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
    setLinkUrl(localLink);
    setShowTimer(localShowTimer);
    setLayoutMode(localLayout);
    setIsGradient(localGradient);
    setTextColor(localTextColor);
    setIconType(localIcon);
    setBannerSize(localSize);
    setMarqueeSpeed(localSpeed);
    setTimerTheme(localTheme);
    toast.success("Announcement settings saved and applied to the site!");
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
              <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Banner Link (Optional)</label>
              <input 
                type="text" 
                value={localLink} 
                onChange={e => setLocalLink(e.target.value)} 
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none" 
                placeholder="https://discord.gg/megatron" 
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Layout Mode</label>
              <select
                value={localLayout}
                onChange={e => setLocalLayout(e.target.value as 'marquee' | 'centered')}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none"
              >
                <option value="centered">Centered (Static)</option>
                <option value="marquee">Scrolling Marquee</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Countdown Target</label>
              <input 
                type="datetime-local" 
                value={localDate} 
                onChange={e => setLocalDate(e.target.value)} 
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none" 
              />
              <div className="mt-3 flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="showTimer" 
                  checked={localShowTimer} 
                  onChange={e => setLocalShowTimer(e.target.checked)} 
                  className="w-4 h-4 rounded border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                <label htmlFor="showTimer" className="text-sm font-bold text-[var(--text-primary)]">Show Timer on Banner</label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Banner Color</label>
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
              <div className="mt-3 flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="isGradient" 
                  checked={localGradient} 
                  onChange={e => setLocalGradient(e.target.checked)} 
                  className="w-4 h-4 rounded border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                <label htmlFor="isGradient" className="text-sm font-bold text-[var(--text-primary)]">Use Glassmorphic Gradient</label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Text Color</label>
              <div className="flex items-center gap-4">
                <input 
                  type="color" 
                  value={localTextColor} 
                  onChange={e => setLocalTextColor(e.target.value)} 
                  className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0" 
                />
                <input 
                  type="text" 
                  value={localTextColor} 
                  onChange={e => setLocalTextColor(e.target.value)} 
                  className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none font-mono uppercase" 
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6 border-t border-[var(--border-color)]">
            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Banner Icon</label>
              <select
                value={localIcon}
                onChange={e => setLocalIcon(e.target.value as any)}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none"
              >
                <option value="Megaphone">Megaphone</option>
                <option value="Star">Star</option>
                <option value="Sparkles">Sparkles</option>
                <option value="Zap">Zap (Lightning)</option>
                <option value="Gift">Gift</option>
                <option value="None">None (Hidden)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Banner Size</label>
              <select
                value={localSize}
                onChange={e => setLocalSize(e.target.value as any)}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none"
              >
                <option value="Slim">Slim</option>
                <option value="Normal">Normal</option>
                <option value="Thick">Thick</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Marquee Speed</label>
              <select
                value={localSpeed}
                onChange={e => setLocalSpeed(e.target.value as any)}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none"
                disabled={localLayout !== 'marquee'}
              >
                <option value="Slow">Slow</option>
                <option value="Normal">Normal</option>
                <option value="Fast">Fast</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Timer Theme</label>
              <select
                value={localTheme}
                onChange={e => setLocalTheme(e.target.value as any)}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none"
                disabled={!localShowTimer}
              >
                <option value="Dark">Dark Box</option>
                <option value="Light">Light Box</option>
                <option value="Outline">Outline Box</option>
              </select>
            </div>
          </div>

          {/* Preview Box */}
          <div className="pt-4">
            <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Live Preview</label>
            <div 
              className={`flex items-center overflow-hidden border border-white/10 rounded-lg relative transition-all ${
                localSize === 'Slim' ? 'h-8' : localSize === 'Thick' ? 'h-14' : 'h-10'
              }`}
              style={localGradient ? {
                background: `linear-gradient(90deg, ${localColor}88 0%, ${localColor} 50%, ${localColor}88 100%)`,
                backdropFilter: 'blur(10px)'
              } : { backgroundColor: localColor }}
            >
              <div className={`flex items-center w-full ${localLayout === 'centered' ? 'justify-center' : ''}`}>
                <div className="flex items-center">
                  {localIcon !== 'None' && (
                    <>
                      {localIcon === 'Megaphone' && <Megaphone className={`ml-4 mr-2 ${localSize === 'Thick' ? 'w-5 h-5' : 'w-4 h-4'}`} style={{ color: localTextColor }} />}
                      {localIcon === 'Star' && <Star className={`ml-4 mr-2 ${localSize === 'Thick' ? 'w-5 h-5' : 'w-4 h-4'}`} style={{ color: localTextColor }} />}
                      {localIcon === 'Sparkles' && <Sparkles className={`ml-4 mr-2 ${localSize === 'Thick' ? 'w-5 h-5' : 'w-4 h-4'}`} style={{ color: localTextColor }} />}
                      {localIcon === 'Zap' && <Zap className={`ml-4 mr-2 ${localSize === 'Thick' ? 'w-5 h-5' : 'w-4 h-4'}`} style={{ color: localTextColor }} />}
                      {localIcon === 'Gift' && <Gift className={`ml-4 mr-2 ${localSize === 'Thick' ? 'w-5 h-5' : 'w-4 h-4'}`} style={{ color: localTextColor }} />}
                    </>
                  )}
                  <span className={`font-bold uppercase tracking-widest px-2 ${localSize === 'Thick' ? 'text-sm' : 'text-xs'}`} style={{ color: localTextColor }}>
                    {localText}
                  </span>
                  {localShowTimer && (
                    <span className={`font-mono font-bold px-2 py-0.5 rounded ml-2 mr-4 ${
                      localSize === 'Thick' ? 'text-sm' : 'text-xs'
                    } ${
                      localTheme === 'Light' ? 'bg-white/90 text-black shadow-sm' :
                      localTheme === 'Outline' ? 'bg-transparent text-white border border-white/40' :
                      'bg-black/30 text-white shadow-inner'
                    }`}>
                      01:23:45:12
                    </span>
                  )}
                </div>
              </div>
            </div>
            {localLink && (
              <p className="text-xs text-[var(--text-secondary)] mt-2">
                Clicking the banner will redirect users to: <span className="text-[var(--accent)] font-bold">{localLink}</span>
              </p>
            )}
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

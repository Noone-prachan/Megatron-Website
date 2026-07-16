import { useState } from "react";
import { Search, Key, LayoutTemplate, Link as LinkIcon, BarChart3, TrendingUp, Users, Target, Trophy, ArrowRight, Loader2, Save, Globe, AlertTriangle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSeo } from "../../context/SeoContext";
import { api } from "../../../lib/api";
import { toast } from "sonner";

export function SeoPage() {
  const [activeTab, setActiveTab] = useState<'onpage' | 'audit' | 'keywords'>('onpage');

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-r from-amber-500/10 to-transparent p-8 rounded-3xl border border-amber-500/20">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] leading-tight tracking-tight mb-2 uppercase">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600">SEO</span> Manager
          </h1>
          <p className="text-xl font-bold text-[var(--text-secondary)] mb-1">
            Real Tools. Real Results.
          </p>
          <p className="text-[var(--text-secondary)] text-sm max-w-md">
            Manage your on-page metadata, audit competitors, and discover high-value keywords.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-[var(--border-color)] pb-2 overflow-x-auto">
        {[
          { id: 'onpage', label: 'On-Page Meta Editor', icon: LayoutTemplate },
          { id: 'audit', label: 'Live Site Audit', icon: Search },
          { id: 'keywords', label: 'Keyword Research', icon: Key }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-xl font-bold text-sm transition-colors border-b-2 ${
              activeTab === tab.id 
                ? 'border-amber-500 text-amber-500 bg-amber-500/10' 
                : 'border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          {activeTab === 'onpage' && <OnPageEditor key="onpage" />}
          {activeTab === 'audit' && <LiveAudit key="audit" />}
          {activeTab === 'keywords' && <KeywordResearch key="keywords" />}
        </AnimatePresence>
      </div>
    </div>
  );
}

function OnPageEditor() {
  const { seoData, updateSeo } = useSeo();
  const [selectedRoute, setSelectedRoute] = useState("/");
  const [title, setTitle] = useState(seoData["/"]?.title || "");
  const [description, setDescription] = useState(seoData["/"]?.description || "");
  const [keywords, setKeywords] = useState(seoData["/"]?.keywords || "");

  const routes = [
    { path: "/", label: "Home Page" },
    { path: "/products", label: "Products Page" },
    { path: "/reviews", label: "Reviews Page" },
    { path: "/team", label: "Team Page" },
    { path: "/faq", label: "FAQ Page" }
  ];

  const handleRouteSelect = (path: string) => {
    setSelectedRoute(path);
    const data = seoData[path] || { title: "", description: "", keywords: "" };
    setTitle(data.title);
    setDescription(data.description);
    setKeywords(data.keywords || "");
  };

  const handleSave = () => {
    updateSeo(selectedRoute, { title, description, keywords });
    toast.success(`SEO tags updated for ${selectedRoute}`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-[var(--bg-secondary)] p-6 rounded-3xl border border-[var(--border-color)]">
        <h3 className="text-xl font-bold mb-6 text-[var(--text-primary)] flex items-center gap-2">
          <LayoutTemplate className="text-amber-500" /> Page Settings
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Select Route</label>
            <div className="flex flex-wrap gap-2">
              {routes.map(r => (
                <button
                  key={r.path}
                  onClick={() => handleRouteSelect(r.path)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${selectedRoute === r.path ? 'bg-amber-500 text-black' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-color)]'}`}
                >
                  {r.label} ({r.path})
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
              Meta Title ({title.length}/60 chars)
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:border-amber-500 outline-none transition-colors"
              placeholder="e.g. Megatron | Premium Gaming Accounts"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
              Meta Description ({description.length}/160 chars)
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:border-amber-500 outline-none transition-colors resize-none"
              placeholder="Describe this page..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
              Meta Keywords (Comma separated)
            </label>
            <input
              type="text"
              value={keywords}
              onChange={e => setKeywords(e.target.value)}
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:border-amber-500 outline-none transition-colors"
              placeholder="gaming, accounts, mlbb"
            />
          </div>

          <button onClick={handleSave} className="w-full bg-amber-500 text-black font-bold py-3 rounded-xl hover:bg-amber-400 transition-colors flex items-center justify-center gap-2">
            <Save className="w-4 h-4" /> Save Meta Tags
          </button>
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] p-6 rounded-3xl border border-[var(--border-color)]">
        <h3 className="text-xl font-bold mb-6 text-[var(--text-primary)] flex items-center gap-2">
          <Globe className="text-blue-500" /> Google Search Preview
        </h3>
        
        <div className="bg-white p-6 rounded-xl font-sans max-w-lg mx-auto shadow-inner border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <Globe className="w-4 h-4 text-gray-500" />
            </div>
            <div>
              <div className="text-[14px] text-[#202124] leading-tight font-normal">Megatron</div>
              <div className="text-[12px] text-[#4d5156] leading-tight">https://your-domain.com{selectedRoute === '/' ? '' : selectedRoute}</div>
            </div>
          </div>
          <h2 className="text-[#1a0dab] text-xl font-normal hover:underline cursor-pointer mb-1 leading-tight truncate">
            {title || "Please enter a meta title"}
          </h2>
          <p className="text-[#4d5156] text-[14px] leading-snug line-clamp-2">
            {description || "Please enter a meta description. This is what users will read when they find your page in search results."}
          </p>
        </div>

        <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3 text-sm text-blue-400">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <p>This is a live preview. When you save, the actual HTML &lt;title&gt; and &lt;meta&gt; tags will dynamically update for visitors using React Helmet.</p>
        </div>
      </div>
    </motion.div>
  );
}

function LiveAudit() {
  const [url, setUrl] = useState("");
  const [isAuditing, setIsAuditing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAudit = async () => {
    if (!url) return toast.error("Please enter a URL");
    setIsAuditing(true);
    setResult(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/seo/audit?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      if (data.success) {
        setResult(data.data);
        toast.success("Audit complete!");
      } else {
        toast.error(data.error || "Failed to audit URL");
      }
    } catch (error) {
      toast.error("Network error auditing URL");
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      <div className="bg-[var(--bg-secondary)] p-6 md:p-8 rounded-3xl border border-[var(--border-color)]">
        <h3 className="text-xl font-bold mb-4 text-[var(--text-primary)]">Run a Live Site Audit</h3>
        <p className="text-[var(--text-secondary)] text-sm mb-6">Enter any URL (your site or a competitor) to parse its HTML and generate an instant technical SEO score.</p>
        
        <div className="flex gap-4">
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:border-amber-500 outline-none"
            onKeyDown={e => e.key === 'Enter' && handleAudit()}
          />
          <button 
            onClick={handleAudit} 
            disabled={isAuditing}
            className="bg-amber-500 text-black font-bold px-8 py-3 rounded-xl hover:bg-amber-400 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isAuditing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            {isAuditing ? 'Scanning...' : 'Audit'}
          </button>
        </div>
      </div>

      {result && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Score Card */}
          <div className="bg-[var(--bg-secondary)] p-8 rounded-3xl border border-[var(--border-color)] flex flex-col items-center justify-center text-center shadow-lg">
            <div className="relative w-32 h-32 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-[var(--border-color)]" strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="currentColor" strokeWidth="3" fill="none" />
                <path 
                  className={result.score > 80 ? "text-emerald-500" : result.score > 50 ? "text-amber-500" : "text-red-500"} 
                  strokeDasharray={`${result.score}, 100`} 
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                  stroke="currentColor" 
                  strokeWidth="3" 
                  fill="none" 
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-4xl font-black text-[var(--text-primary)]">{result.score}</span>
            </div>
            <h3 className="font-bold text-lg">Overall SEO Health</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-2">Based on critical on-page technical factors.</p>
          </div>

          {/* Details */}
          <div className="lg:col-span-2 bg-[var(--bg-secondary)] p-6 md:p-8 rounded-3xl border border-[var(--border-color)] shadow-lg space-y-6">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-3">Extracted Meta Data</h4>
              <div className="space-y-3">
                <div className="bg-[var(--bg-primary)] p-3 rounded-lg border border-[var(--border-color)]">
                  <span className="text-xs font-bold text-amber-500 block mb-1">Title</span>
                  <p className="text-sm">{result.meta.title || <span className="text-red-400">Missing</span>}</p>
                </div>
                <div className="bg-[var(--bg-primary)] p-3 rounded-lg border border-[var(--border-color)]">
                  <span className="text-xs font-bold text-amber-500 block mb-1">Description</span>
                  <p className="text-sm">{result.meta.description || <span className="text-red-400">Missing</span>}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-3">Structure & Media</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[var(--bg-primary)] p-3 rounded-lg border border-[var(--border-color)] text-center">
                  <div className="text-xl font-bold">{result.structure.h1s}</div>
                  <div className="text-[10px] text-[var(--text-secondary)] uppercase mt-1">H1 Tags</div>
                </div>
                <div className="bg-[var(--bg-primary)] p-3 rounded-lg border border-[var(--border-color)] text-center">
                  <div className="text-xl font-bold">{result.structure.h2s}</div>
                  <div className="text-[10px] text-[var(--text-secondary)] uppercase mt-1">H2 Tags</div>
                </div>
                <div className="bg-[var(--bg-primary)] p-3 rounded-lg border border-[var(--border-color)] text-center">
                  <div className="text-xl font-bold">{result.media.totalImages}</div>
                  <div className="text-[10px] text-[var(--text-secondary)] uppercase mt-1">Images</div>
                </div>
                <div className="bg-[var(--bg-primary)] p-3 rounded-lg border border-red-500/30 bg-red-500/5 text-center">
                  <div className="text-xl font-bold text-red-500">{result.media.imagesWithoutAlt}</div>
                  <div className="text-[10px] text-red-400 uppercase mt-1">Missing Alts</div>
                </div>
              </div>
            </div>

            {result.warnings.length > 0 && (
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-red-500 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Actionable Warnings
                </h4>
                <ul className="space-y-2">
                  {result.warnings.map((w: string, i: number) => (
                    <li key={i} className="text-sm text-[var(--text-secondary)] flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function KeywordResearch() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const handleSearch = async () => {
    if (!query) return toast.error("Please enter a seed keyword");
    setIsSearching(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/seo/keywords?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (data.success) {
        setSuggestions(data.suggestions);
      } else {
        toast.error("Failed to fetch suggestions");
      }
    } catch (error) {
      toast.error("Network error fetching keywords");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      <div className="bg-[var(--bg-secondary)] p-6 md:p-8 rounded-3xl border border-[var(--border-color)]">
        <h3 className="text-xl font-bold mb-4 text-[var(--text-primary)]">Keyword Discovery</h3>
        <p className="text-[var(--text-secondary)] text-sm mb-6">Enter a seed word (e.g. "MLBB account") to generate long-tail search terms based on real search engine autocomplete data.</p>
        
        <div className="flex gap-4 max-w-2xl">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Seed keyword..."
            className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:border-amber-500 outline-none"
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <button 
            onClick={handleSearch} 
            disabled={isSearching}
            className="bg-emerald-500 text-black font-bold px-8 py-3 rounded-xl hover:bg-emerald-400 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Key className="w-5 h-5" />}
            {isSearching ? 'Searching...' : 'Research'}
          </button>
        </div>
      </div>

      {suggestions.length > 0 && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl overflow-hidden shadow-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--bg-primary)] border-b border-[var(--border-color)]">
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">Suggested Keyword</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] text-right">Est. Volume (Mock)</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] text-right">Difficulty (Mock)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {suggestions.map((s, i) => (
                <tr key={i} className="hover:bg-[var(--bg-primary)] transition-colors">
                  <td className="py-4 px-6 font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <Search className="w-3 h-3 text-[var(--text-secondary)]" /> {s.keyword}
                  </td>
                  <td className="py-4 px-6 text-right text-emerald-400 font-mono">{s.volume.toLocaleString()}</td>
                  <td className="py-4 px-6 text-right">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${s.difficulty > 50 ? 'bg-red-500/10 text-red-500' : s.difficulty > 30 ? 'bg-amber-500/10 text-amber-500' : 'bg-green-500/10 text-green-500'}`}>
                      {s.difficulty} / 100
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </motion.div>
  );
}

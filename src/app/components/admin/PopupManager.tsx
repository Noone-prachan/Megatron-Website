import { useState, useRef } from "react";
import { usePopups, PopupItem } from "../../context/PopupContext";
import { Plus, Trash2, Power, Pencil, Save, X, ExternalLink, Image, Upload, Link as LinkIcon, MonitorPlay, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

const EMPTY: Omit<PopupItem, "id"> = {
  title: "",
  content: "",
  imageUrl: "",
  linkUrl: "",
  enabled: true,
  showOnce: false,
};

export function PopupManager() {
  const { popups, addPopup, updatePopup, deletePopup, togglePopup } = usePopups();
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [imageTab, setImageTab] = useState<"url" | "upload">("url");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openAdd = () => { setForm(EMPTY); setEditingId(null); setShowForm(true); setImageTab("url"); };
  const openEdit = (p: PopupItem) => {
    setForm({ title: p.title, content: p.content ?? "", imageUrl: p.imageUrl, linkUrl: p.linkUrl, enabled: p.enabled, showOnce: p.showOnce });
    setEditingId(p.id);
    setShowForm(true);
    setImageTab(p.imageUrl.startsWith("data:") ? "upload" : "url");
  };
  const cancel = () => { setShowForm(false); setEditingId(null); };

  const loadFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5 MB."); return; }
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file."); return; }
    const reader = new FileReader();
    reader.onload = e => setForm(f => ({ ...f, imageUrl: e.target?.result as string }));
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.imageUrl.trim()) { toast.error("Please provide an image URL or upload a file."); return; }
    if (editingId) { updatePopup(editingId, form); toast.success("Popup updated."); }
    else { addPopup(form); toast.success("Popup created."); }
    cancel();
  };

  const activeCount = popups.filter(p => p.enabled).length;

  return (
    <div className="space-y-8 max-w-5xl">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-primary)]">Popup Manager</h1>
          <p className="text-[var(--text-secondary)] mt-1 text-sm">
            Announcement popups shown to visitors on page load.
            {activeCount > 0 && <span className="ml-2 text-[var(--accent)] font-bold">{activeCount} active</span>}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-95"
        >
          <Plus className="w-4 h-4" /> New Popup
        </button>
      </div>


      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-xl"
          >
            {/* Form header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/40">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/15 border border-[var(--accent)]/25 flex items-center justify-center">
                  <MonitorPlay className="w-4 h-4 text-[var(--accent)]" />
                </div>
                <h2 className="text-base font-black text-[var(--text-primary)]">{editingId ? "Edit Popup" : "Create New Popup"}</h2>
              </div>
              <button onClick={cancel} className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Left column */}
                <div className="space-y-5">
                  {/* Image field */}
                  <div>
                    <label className="block text-xs font-black text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                      Image <span className="text-red-400">*</span>
                    </label>
                    <div className="flex gap-1 mb-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-1 w-fit">
                      {(["url", "upload"] as const).map(tab => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setImageTab(tab)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${imageTab === tab ? "bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
                        >
                          {tab === "url" ? <LinkIcon className="w-3 h-3" /> : <Upload className="w-3 h-3" />}
                          {tab === "url" ? "URL" : "Upload"}
                        </button>
                      ))}
                    </div>

                    {imageTab === "url" ? (
                      <input
                        type="text"
                        value={form.imageUrl.startsWith("data:") ? "" : form.imageUrl}
                        onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                        placeholder="https://example.com/banner.jpg"
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none transition-colors"
                      />
                    ) : (
                      <div
                        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-full border-2 border-dashed rounded-xl py-7 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${isDragging ? "border-[var(--accent)] bg-[var(--accent)]/5 scale-[1.01]" : "border-[var(--border-color)] hover:border-[var(--accent)]/50 bg-[var(--bg-primary)]"}`}
                      >
                        <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center">
                          <Upload className="w-5 h-5 text-[var(--text-secondary)]" />
                        </div>
                        <p className="text-sm font-bold text-[var(--text-primary)]">Click or drag & drop</p>
                        <p className="text-xs text-[var(--text-secondary)]">PNG, JPG, GIF, WebP — max 5 MB</p>
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); }} />
                      </div>
                    )}

                    {/* Image preview */}
                    {form.imageUrl && (
                      <div className="mt-3 relative rounded-xl overflow-hidden border border-[var(--border-color)] bg-[var(--bg-primary)] aspect-video">
                        <img
                          src={form.imageUrl}
                          alt="preview"
                          className="w-full h-full object-cover"
                          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                        <button
                          type="button"
                          onClick={() => setForm(f => ({ ...f, imageUrl: "" }))}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white border border-white/20 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Link URL */}
                  <div>
                    <label className="block text-xs font-black text-[var(--text-secondary)] uppercase tracking-wider mb-2">Link URL <span className="text-[var(--text-secondary)] font-normal normal-case tracking-normal">(optional)</span></label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                      <input
                        type="text"
                        value={form.linkUrl}
                        onChange={e => setForm(f => ({ ...f, linkUrl: e.target.value }))}
                        placeholder="https://discord.gg/megatron"
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-5">
                  {/* Title */}
                  <div>
                    <label className="block text-xs font-black text-[var(--text-secondary)] uppercase tracking-wider mb-2">Title <span className="text-[var(--text-secondary)] font-normal normal-case tracking-normal">(optional)</span></label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                      placeholder="e.g. Flash Sale — 50% Off Today!"
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none transition-colors"
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-xs font-black text-[var(--text-secondary)] uppercase tracking-wider mb-2">Content <span className="text-[var(--text-secondary)] font-normal normal-case tracking-normal">(optional)</span></label>
                    <textarea
                      value={form.content}
                      onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                      placeholder="Describe your announcement, promotion, or event details here..."
                      rows={5}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none transition-colors resize-none leading-relaxed"
                    />
                  </div>

                  {/* Toggles */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: "enabled", label: "Enabled", sub: "Show to visitors", icon: Eye, activeColor: "text-green-400 bg-green-500/10 border-green-500/20" },
                      { key: "showOnce", label: "Show Once", sub: "Per browser session", icon: EyeOff, activeColor: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
                    ].map(({ key, label, sub, icon: Icon, activeColor }) => {
                      const val = form[key as keyof typeof form] as boolean;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setForm(f => ({ ...f, [key]: !val }))}
                          className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${val ? activeColor : "bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-secondary)]"}`}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          <div>
                            <p className="text-xs font-black leading-none mb-0.5">{label}</p>
                            <p className="text-[10px] opacity-70 leading-none">{sub}</p>
                          </div>
                          <div className={`ml-auto w-8 h-4 rounded-full transition-colors relative shrink-0 ${val ? "bg-current" : "bg-[var(--border-color)]"}`}>
                            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${val ? "left-[18px]" : "left-0.5"}`} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Form actions */}
              <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-[var(--border-color)]">
                <button type="button" onClick={cancel} className="px-5 py-2.5 rounded-xl border border-[var(--border-color)] text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-95">
                  <Save className="w-4 h-4" /> {editingId ? "Save Changes" : "Create Popup"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popup list */}
      {popups.length === 0 ? (
        <div className="bg-[var(--bg-secondary)] border border-dashed border-[var(--border-color)] rounded-2xl p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-center mx-auto mb-4">
            <MonitorPlay className="w-7 h-7 text-[var(--text-secondary)] opacity-40" />
          </div>
          <p className="text-[var(--text-primary)] font-bold mb-1">No popups yet</p>
          <p className="text-[var(--text-secondary)] text-sm">Click "New Popup" to create your first announcement popup.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {popups.map((p, i) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`bg-[var(--bg-secondary)] border rounded-2xl overflow-hidden transition-all group ${p.enabled ? "border-[var(--border-color)] hover:border-[var(--accent)]/40" : "border-[var(--border-color)] opacity-55"}`}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-[var(--bg-primary)] overflow-hidden">
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.title || "Popup"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="w-8 h-8 text-[var(--text-secondary)] opacity-20" />
                  </div>
                )}
                {/* Status badge */}
                <div className={`absolute top-2 left-2 text-[10px] font-black px-2 py-1 rounded-full backdrop-blur-sm border ${p.enabled ? "bg-green-500/20 border-green-500/30 text-green-300" : "bg-red-500/20 border-red-500/30 text-red-300"}`}>
                  {p.enabled ? "● Active" : "○ Off"}
                </div>
                {p.showOnce && (
                  <div className="absolute top-2 right-2 text-[10px] font-black px-2 py-1 rounded-full backdrop-blur-sm bg-blue-500/20 border border-blue-500/30 text-blue-300">
                    Once
                  </div>
                )}
                {/* Index */}
                <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-black/60 border border-white/15 flex items-center justify-center text-[10px] font-black text-white/70">
                  {i + 1}
                </div>
              </div>

              {/* Card body */}
              <div className="p-4">
                <p className="text-sm font-black text-[var(--text-primary)] truncate mb-1">{p.title || "Untitled Popup"}</p>
                {p.content && <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed mb-2">{p.content}</p>}
                {p.linkUrl && (
                  <a href={p.linkUrl} target="_blank" rel="noreferrer" className="text-[10px] text-[var(--accent)] hover:underline flex items-center gap-1 w-fit mb-3">
                    <ExternalLink className="w-3 h-3" />
                    <span className="truncate max-w-[180px]">{p.linkUrl}</span>
                  </a>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-[var(--border-color)]">
                  <button
                    onClick={() => togglePopup(p.id)}
                    title={p.enabled ? "Disable" : "Enable"}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold border transition-colors ${p.enabled ? "bg-green-500/10 border-green-500/20 text-green-400 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400" : "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-green-500/10 hover:border-green-500/20 hover:text-green-400"}`}
                  >
                    <Power className="w-3 h-3" /> {p.enabled ? "Disable" : "Enable"}
                  </button>
                  <button
                    onClick={() => openEdit(p)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]/50 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => { deletePopup(p.id); toast.success("Popup deleted."); }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

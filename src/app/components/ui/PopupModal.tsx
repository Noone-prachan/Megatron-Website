import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { usePopups } from "../../context/PopupContext";
import { useLockBodyScroll } from "../../../hooks/useLockBodyScroll";
import { useLocation } from "react-router-dom";

const SEEN_KEY = "megatron_popups_seen";

function ScrollLock() {
  useLockBodyScroll(true);
  return null;
}

export function PopupModal() {
  const { popups } = usePopups();
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');
  const activePopups = popups.filter(p => p.enabled);

  const getToShow = () => {
    const seen: string[] = JSON.parse(localStorage.getItem(SEEN_KEY) || "[]");
    return activePopups.filter(p => !p.showOnce || !seen.includes(p.id));
  };

  useEffect(() => {
    if (isAdminRoute) return;
    if (activePopups.length === 0) return;
    if (getToShow().length === 0) return;
    const t = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popups.length, isAdminRoute]);

  const toShow = getToShow();
  const current = toShow[index];
  const go = (next: number) => setIndex(Math.max(0, Math.min(toShow.length - 1, next)));

  const close = () => {
    const seen: string[] = JSON.parse(localStorage.getItem(SEEN_KEY) || "[]");
    const newSeen = [...new Set([...seen, ...toShow.filter(p => p.showOnce).map(p => p.id)])];
    localStorage.setItem(SEEN_KEY, JSON.stringify(newSeen));
    setVisible(false);
  };

  if (!visible || !current || isAdminRoute) return null;

  const hasBottom = !!(current.title || current.content || current.linkUrl);

  return (
    <AnimatePresence>
      {/* ScrollLock is a component so the hook is always called at the top level of that component */}
      <ScrollLock />
      <div
        className="fixed inset-0 z-[999] flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
        onClick={close}
      >
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 0.93, y: 28 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 28 }}
          transition={{ type: "spring", damping: 26, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-sm flex flex-col overflow-hidden rounded-2xl border border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.7)]"
          style={{ background: "var(--bg-secondary)", maxHeight: "calc(100dvh - 32px)" }}
        >
          {/* Image */}
          <div className="relative w-full bg-black overflow-hidden">
            <img
              src={current.imageUrl}
              alt={current.title || "Popup"}
              className="w-full h-auto block"
              style={{ maxHeight: hasBottom ? "52vh" : "75vh", objectFit: "contain" }}
            />
            {hasBottom && (
              <div
                className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none"
                style={{ background: "linear-gradient(to top, var(--bg-secondary), transparent)" }}
              />
            )}
            {!hasBottom && toShow.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {toShow.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => go(i)}
                    className={`rounded-full transition-all duration-300 ${i === index ? "w-5 h-2 bg-white" : "w-2 h-2 bg-white/50 hover:bg-white/80"}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Bottom content */}
          {hasBottom && (
            <div className="flex flex-col gap-3 px-5 pt-3 pb-5">
              {current.title && (
                <h2 className="text-base font-black text-[var(--text-primary)] leading-snug text-center">{current.title}</h2>
              )}
              {current.content && (
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{current.content}</p>
              )}
              {current.linkUrl && (
                <a
                  href={current.linkUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={close}
                  className="inline-flex items-center justify-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white text-sm font-bold px-5 py-2.5 rounded-xl w-full transition-all active:scale-95 mt-1"
                >
                  Learn More <ArrowRight className="w-4 h-4" />
                </a>
              )}
              {toShow.length > 1 && (
                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]">
                  <button
                    onClick={() => go(index - 1)}
                    disabled={index === 0}
                    className="w-7 h-7 rounded-full border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-25 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex gap-1.5 items-center">
                    {toShow.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => go(i)}
                        className={`rounded-full transition-all duration-300 ${i === index ? "w-5 h-1.5 bg-[var(--accent)]" : "w-1.5 h-1.5 bg-[var(--border-color)] hover:bg-[var(--text-secondary)]"}`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => go(index + 1)}
                    disabled={index === toShow.length - 1}
                    className="w-7 h-7 rounded-full border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-25 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Close */}
          <button
            onClick={close}
            className="absolute top-2.5 right-2.5 z-30 w-7 h-7 rounded-full bg-black/70 hover:bg-black border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

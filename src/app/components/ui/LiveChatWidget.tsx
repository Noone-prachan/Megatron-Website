import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, ChevronRight, User, Trash2, Zap, HelpCircle, Star, ShieldCheck, Bug, Rocket, DollarSign, ShoppingCart } from 'lucide-react';
import { api } from '../../../lib/api';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useLockBodyScroll } from '../../../hooks/useLockBodyScroll';

const CustomChatToast = ({ t, title, description, onReply }: { t: string | number, title: string, description: string, onReply: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-[#1a1b26]/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-3 w-80 relative overflow-hidden group cursor-pointer"
      onClick={() => {
        onReply();
        toast.dismiss(t);
      }}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-colors"></div>
      
      <div className="shrink-0 w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center relative z-10">
        <MessageSquare className="w-4 h-4 text-blue-400" />
      </div>
      
      <div className="flex-1 relative z-10">
        <p className="text-sm font-bold text-white/90 leading-tight">
          {title}: {description}
        </p>
        <p className="text-[10px] font-semibold text-white/40 mt-1 uppercase tracking-wider flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
          New Message
        </p>
      </div>
      
      <button 
        onClick={(e) => {
          e.stopPropagation();
          toast.dismiss(t);
        }} 
        className="absolute top-2 right-2 text-white/30 hover:text-white/60 transition-colors z-20"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
    </motion.div>
  );
};

export function LiveChatWidget() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showFaq, setShowFaq] = useState(true);
  const [input, setInput] = useState('');
  const [ticketId, setTicketId] = useState<string | null>(localStorage.getItem('chat_ticket_id'));
  const [isConnecting, setIsConnecting] = useState(false);
  const [isClaimed, setIsClaimed] = useState<boolean>(localStorage.getItem('chat_is_claimed') === 'true');
  const [staffName, setStaffName] = useState<string | null>(localStorage.getItem('chat_staff_name'));
  const [unreadCount, setUnreadCount] = useState(0);
  const isOpenRef = useRef(isOpen);
  const isMobile = window.innerWidth < 768;

  useLockBodyScroll(isOpen && isMobile);

  useEffect(() => {
    isOpenRef.current = isOpen;
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);
  
  // Autoclose on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'home'|'messages'|'guides'>('home');
  const [staffAvatars, setStaffAvatars] = useState<Record<string, string>>({});

  // Fetch live staff avatars from our Discord proxy
  const STAFF_IDS = ['570146481663770634', '913826949820997654', '850383604404322304'];
  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    STAFF_IDS.forEach(async (id) => {
      try {
        const res = await fetch(`${apiBase}/users/${id}`);
        if (res.ok) {
          const data = await res.json();
          setStaffAvatars(prev => ({ ...prev, [id]: data.avatarUrl }));
        }
      } catch {
        // keep fallback
      }
    });
  }, []);
  useEffect(() => {
    const handleMobileMenu = (e: any) => setIsMobileMenuOpen(e.detail);
    window.addEventListener('mobileMenuToggled', handleMobileMenu);
    return () => window.removeEventListener('mobileMenuToggled', handleMobileMenu);
  }, []);

  const [messages, setMessages] = useState<{sender: 'bot'|'user', text: string, isTransferPrompt?: boolean}[]>(() => {
    const saved = localStorage.getItem('chat_messages');
    if (saved) return JSON.parse(saved);
    return [{ sender: 'bot', text: 'Hi there! 👋 How can we help you today?' }];
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    localStorage.setItem('chat_messages', JSON.stringify(messages));
  }, [messages, showFaq]);

  useEffect(() => {
    if (!ticketId) return;
    
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    const eventSource = new EventSource(`${apiUrl}/chat/stream?ticketId=${ticketId}`);
    
    eventSource.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === 'connected') return;
      
      if (data.type === 'claimed') {
        if (!isClaimed) {
          setIsClaimed(true);
          setStaffName(data.staffName);
          localStorage.setItem('chat_is_claimed', 'true');
          localStorage.setItem('chat_staff_name', data.staffName);
          setMessages(prev => [...prev, { sender: 'bot', text: `⚡ ${data.staffName} has joined the chat!` }]);
          if (!isOpenRef.current) {
            setUnreadCount(prev => prev + 1);
            toast.custom((t) => (
              <CustomChatToast 
                t={t} 
                title={`${data.staffName} has joined the chat!`} 
                description="Click here to view their message."
                onReply={() => setIsOpen(true)} 
              />
            ), { duration: 5000, position: 'bottom-left' });
          }
        }
        return;
      }
      
      if (data.type === 'closed') {
         setTicketId(null);
         setIsClaimed(false);
         setStaffName(null);
         localStorage.removeItem('chat_ticket_id');
         localStorage.removeItem('chat_is_claimed');
         localStorage.removeItem('chat_staff_name');
         setMessages(prev => [...prev, { sender: 'bot', text: '🔒 This ticket has been marked as solved and closed.' }]);
         if (!isOpenRef.current) setUnreadCount(prev => prev + 1);
         return;
      }
      
      setMessages(prev => [...prev, { sender: 'bot', text: data.text }]);
      if (!isOpenRef.current) {
         setUnreadCount(prev => prev + 1);
         toast.custom((t) => (
           <CustomChatToast 
             t={t} 
             title={`New message from ${isClaimed ? staffName : 'support'}`} 
             description={data.text}
             onReply={() => setIsOpen(true)} 
           />
         ), { duration: 5000, position: 'bottom-left' });
      }
    };
    
    return () => eventSource.close();
  }, [ticketId, isClaimed]);

  const handleSend = async () => {
    if (!input.trim() || isConnecting) return;
    const userMsg = input.trim();
    
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput("");
    setShowFaq(false);

    // If ticket is already claimed by staff, just send to staff directly, NO bot matching
    if (ticketId && isClaimed) {
      const discordName = localStorage.getItem("discord_global_name") || localStorage.getItem("discord_username") || "Guest";
      try {
        await api.sendLiveChatMessage(ticketId, userMsg, discordName);
      } catch (err: any) {
        console.error("Failed to send chat message", err);
        // If the ticket was deleted on Discord
        if (err?.message?.includes('not found') || err?.code === 'CHANNEL_NOT_FOUND' || err?.message?.includes('Unknown Channel')) {
          setTicketId(null);
          setIsClaimed(false);
          setStaffName(null);
          localStorage.removeItem('chat_ticket_id');
          localStorage.removeItem('chat_is_claimed');
          localStorage.removeItem('chat_staff_name');
          setMessages(prev => [...prev, { sender: 'bot', text: 'This ticket was closed by staff. If you still need help, simply send another message to start a new chat!' }]);
        } else {
          setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, we failed to deliver your message. Please try opening a Discord ticket directly!' }]);
        }
      }
      return;
    }

    // Automated bot matching (only if not claimed)
    const lower = userMsg.toLowerCase();
    let botReply = "";
    
    if (lower.includes("price") || lower.includes("cost") || lower.includes("discount")) {
      botReply = "All our prices are final, but we occasionally run sales! Keep an eye on our announcements.";
    } else if (lower.includes("delivery") || lower.includes("how long") || lower.includes("time")) {
      botReply = "Delivery usually takes 10-15 minutes after you create a ticket in our Discord server.";
    } else if (lower.includes("safe") || lower.includes("scam") || lower.includes("trusted") || lower.includes("legit") || lower.includes("warranty")) {
      botReply = "Yes! All accounts are 100% verified, and come with a 1-month guarantee and full email access.";
    } else if (lower.includes("pay") || lower.includes("buy") || lower.includes("method") || lower.includes("paypal")) {
      botReply = "We do NOT accept PayPal or international payments. We ONLY accept local payment methods through our secure Discord ticket system.";
    } else if (lower.includes("email") || lower.includes("change data") || lower.includes("secure") || lower.includes("change password") || lower.includes("safe") || lower.includes("warranty")) {
      botReply = "Yes! All our accounts come with full email access, so you can secure it with your own details. The guarantee is valid for 1 month.";
    } else if (lower.includes("assistance") || lower.includes("help") || lower.includes("hello") || lower.includes("hi") || lower.includes("hey") || lower.includes("yo") || lower.includes("sup")) {
      botReply = "How can we assist you today? Please describe your issue or question in detail.";
    } else if (lower.includes("review")) {
      botReply = "You can read our verified customer reviews directly on the Reviews page of our website!";
    } else if (lower.includes("guarantee") || lower.includes("replace")) {
      botReply = "We do not replace accounts. The guarantee is valid for 1 month from the date of purchase.";
    } else if (lower.includes("bug")) {
      botReply = "Thanks for helping us improve! Please describe the bug you encountered and a staff member will investigate.";
    } else if (lower.includes("booster") || lower.includes("boost")) {
      botReply = "We provide professional boosting services to help you reach your desired rank! Let us know your current and target rank.";
    } else if (lower.includes("powerseller") || lower.includes("application")) {
      botReply = "Interested in selling in bulk? Submit your Powerseller Application by providing your discord ID and inventory details.";
    }

    if (botReply) {
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
        if (!isOpenRef.current) setUnreadCount(prev => prev + 1);
      }, 600);
      return;
    }

    // If bot couldn't answer, route to staff or prompt for staff
    if (ticketId) {
      if (!isClaimed) {
        setTimeout(() => {
          setMessages(prev => [...prev, { sender: 'bot', text: 'Please wait, a staff member will be with you shortly. Average wait time: 2-3 minutes.' }]);
        }, 600);
        return;
      }
    }

    // If no ticket, ask to transfer
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: "I'm not quite sure about that. Would you like to transfer to a human staff member?",
        isTransferPrompt: true 
      }]);
    }, 600);
  };

  const handleTransferToStaff = async () => {
    const discordId = localStorage.getItem("discord_id");
    const discordName = localStorage.getItem("discord_global_name") || localStorage.getItem("discord_username") || "Guest";
    
    setIsConnecting(true);
    setMessages(prev => [...prev, { sender: 'user', text: 'Yes, please transfer me.' }]);
    
    try {
      const initRes = await api.initLiveChat(discordName, discordId || undefined);
      if (initRes.success) {
        setTicketId(initRes.ticketId);
        setIsClaimed(false);
        setStaffName(null);
        localStorage.setItem('chat_ticket_id', initRes.ticketId);
        localStorage.setItem('chat_is_claimed', 'false');
        localStorage.removeItem('chat_staff_name');
        setMessages(prev => [...prev, { sender: 'bot', text: 'Transferring to staff... Please wait.' }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, we failed to create a ticket. Please open a Discord ticket directly!' }]);
    }
    setIsConnecting(false);
  };

  const handleFaqClick = async (q: string, a: string) => {
    setMessages(prev => [...prev, { sender: 'user', text: q }]);
    setShowFaq(false);
    
    // Always let the bot answer FAQs locally if not claimed!
    if (ticketId && isClaimed) {
      const discordName = localStorage.getItem("discord_global_name") || localStorage.getItem("discord_username") || "Guest";
      try {
        await api.sendLiveChatMessage(ticketId, q, discordName);
      } catch (e) {
        console.error(e);
      }
    } else {
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'bot', text: a }]);
        if (!isOpenRef.current) setUnreadCount(prev => prev + 1);
      }, 600);
    }
  };

  const handleClearChat = () => {
    setMessages([{ sender: 'bot', text: 'Hi there! 👋 How can we help you today?' }]);
    setShowFaq(true);
    localStorage.removeItem('chat_messages');
  };

  const faqs = [
    { q: "How long does delivery take?", a: "Delivery usually takes 10-15 minutes after you create a ticket in our Discord server." },
    { q: "Are the accounts safe?", a: "Yes! All accounts are 100% verified, and come with a 1-month guarantee and full email access." },
    { q: "How do I pay?", a: "We do NOT accept PayPal or international payments. We ONLY accept local payment methods through our secure Discord ticket system." },
    { q: "Can I change the email?", a: "Yes! All our accounts come with full email access, so you can secure it with your own details." },
    { q: "How do I claim my account?", a: "Once payment is confirmed in the Discord ticket, we will hand over the account credentials immediately." }
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-[360px] h-[600px] bg-[#1a1b26] border border-white/10 rounded-[2rem] shadow-2xl z-[100] overflow-hidden flex flex-col text-white font-sans"
          >
            {/* Header / Top Background for Home */}
            <div className={`relative flex-shrink-0 transition-all duration-300 ${activeTab === 'home' ? 'h-56' : 'h-16'}`}>
              {activeTab === 'home' && (
                <div className="absolute inset-0 z-0">
                  <div className="absolute inset-0 bg-[url('/images/hero-banner.png')] bg-cover bg-center opacity-40 mix-blend-screen"></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-[#1a1b26]/40 via-[#1a1b26]/80 to-[#1a1b26]"></div>
                </div>
              )}
              <div className="absolute inset-0 z-10 p-5 flex flex-col justify-between">
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-2">
                    <img src="/images/megatronlogo.png" alt="Megatron" className="w-6 h-6 object-contain" />
                    <span className="font-bold text-lg tracking-tight">megatron</span>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 bg-black/20 hover:bg-black/40 rounded-full transition-colors text-white/70 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                {activeTab === 'home' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="mt-4"
                  >
                    <div className="flex -space-x-2 mb-3">
                      {STAFF_IDS.map((id) => (
                        <img
                          key={id}
                          src={staffAvatars[id] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`}
                          alt="Staff"
                          className="w-8 h-8 rounded-full border-2 border-[#1a1b26] object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`; }}
                        />
                      ))}
                    </div>
                    <h2 className="text-2xl font-black leading-tight">Hi there 👋<br/>How can we help?</h2>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col relative z-10 bg-[#1a1b26]">
              {activeTab === 'home' && (
                <div className="p-5 h-full overflow-y-auto custom-scrollbar flex flex-col gap-4">
                  {/* Recent Message Card */}
                  <div 
                    onClick={() => setActiveTab('messages')}
                    className="bg-white/5 border border-white/10 p-4 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors flex gap-3 items-center"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center border border-white/10 overflow-hidden">
                        <img src="/images/megatronlogo.png" alt="Bot" className="w-6 h-6 object-contain" />
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a1b26]"></div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-bold text-white truncate">{messages[messages.length - 1]?.text || "Hello! I'm Megatron's AI..."}</p>
                      <p className="text-xs text-white/50 mt-1">Megatron Support • Just now</p>
                    </div>
                  </div>

                  {/* Ask me anything input block */}
                  <div className="relative mt-2">
                    <input 
                      type="text" 
                      placeholder="Ask me anything..." 
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-white/20 transition-colors placeholder:text-white/40"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                           const val = e.currentTarget.value;
                           setInput(val);
                           setActiveTab('messages');
                           // We need to wait for state to update, this is a bit hacky but works for UI demo
                           setTimeout(() => {
                             const sendBtn = document.getElementById('chat-send-btn');
                             if(sendBtn) sendBtn.click();
                           }, 100);
                        }
                      }}
                    />
                    <button 
                      onClick={() => setActiveTab('messages')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                    </button>
                  </div>

                  {/* Quick Links Grid */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {[
                      { label: 'Assistance', icon: <HelpCircle className="w-3 h-3 text-rose-400" />, q: 'help', a: 'How can we assist you today? Please describe your issue or question in detail.' },
                      { label: 'Reviews', icon: <Star className="w-3 h-3 text-yellow-400" />, q: 'reviews', a: 'You can read our verified customer reviews directly on the Reviews page of our website!' },
                      { label: 'Guarantee', icon: <ShieldCheck className="w-3 h-3 text-blue-400" />, q: 'guarantee', a: 'We do not replace accounts. The guarantee is valid for 1 month from the date of purchase.' },
                      { label: 'Bug Report', icon: <Bug className="w-3 h-3 text-red-400" />, q: 'bug', a: 'Thanks for helping us improve! Please describe the bug you encountered and a staff member will investigate.' },
                      { label: 'Boosting Services', icon: <Rocket className="w-3 h-3 text-purple-400" />, q: 'boost', a: 'We provide professional boosting services to help you reach your desired rank! Let us know your current and target rank.' },
                      { label: 'Powerseller Application', icon: <ShoppingCart className="w-3 h-3 text-gray-400" />, q: 'powerseller application', a: 'Interested in selling in bulk? Submit your Powerseller Application by providing your discord ID and inventory details.' }
                    ].map((item) => (
                      <button 
                        key={item.label}
                        onClick={() => {
                          setActiveTab('messages');
                          handleFaqClick(item.label, item.a);
                        }}
                        className="bg-white/5 hover:bg-white/10 border border-white/5 px-3 py-1.5 rounded-full text-xs font-semibold text-white/80 hover:text-white transition-colors flex items-center gap-1.5"
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Watermark */}
                  <div className="mt-auto pt-6 pb-2 text-center">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center justify-center gap-1">
                      <Zap className="w-3 h-3 text-yellow-500" /> Powered by Megatron
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'messages' && (
                <>
                  <div className="px-4 py-2 border-b border-white/5 flex justify-between items-center bg-white/5 shrink-0">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Live Support</span>
                    <button 
                      onClick={() => {
                        setMessages([{ sender: 'bot', text: 'Chat history cleared. How can I help you today?' }]);
                        localStorage.removeItem('megatron_chat_messages');
                        setTicketId(null);
                      }}
                      className="text-white/40 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-white/10"
                      title="Clear Chat"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="p-4 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                    {messages.map((msg, idx) => (
                      <div key={idx} className={`flex gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 overflow-hidden ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-white/10'}`}>
                          {msg.sender === 'user' ? <User className="w-3 h-3" /> : <img src="/images/megatronlogo.png" alt="Bot" className="w-4 h-4 object-contain" />}
                        </div>
                        <div className={`p-2.5 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-tr-sm' : 'bg-white/5 border border-white/10 text-white/90 rounded-tl-sm'}`}>
                          {msg.text}
                          {msg.isTransferPrompt && !ticketId && (
                            <div className="mt-2 flex justify-end">
                              <button 
                                onClick={handleTransferToStaff}
                                disabled={isConnecting}
                                className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                              >
                                {isConnecting ? 'Connecting...' : 'Yes, transfer to staff'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  
                  {/* Messages Input */}
                  <div className="p-3 border-t border-white/10 bg-white/5">
                    <div className="relative flex items-center gap-2">
                      <input 
                        type="text" 
                        placeholder="Type a message..." 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 bg-transparent border-none focus:outline-none text-sm text-white placeholder:text-white/40 pl-2"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSend();
                        }}
                      />
                      <button 
                        id="chat-send-btn"
                        onClick={handleSend}
                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shrink-0"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'guides' && (
                <div className="p-5 h-full overflow-y-auto custom-scrollbar text-center flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 text-white/40">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                  </div>
                  <h3 className="font-bold text-white mb-2">Help Center</h3>
                  <p className="text-xs text-white/50 mb-6">Browse our guides and FAQs to quickly find the answers you need.</p>
                  
                  <div className="w-full space-y-2 text-left">
                    {faqs.slice(0, 4).map((faq, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 p-3 rounded-xl cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => {
                          setInput(faq.q);
                          setActiveTab('messages');
                          setTimeout(() => {
                             const sendBtn = document.getElementById('chat-send-btn');
                             if(sendBtn) sendBtn.click();
                           }, 100);
                        }}
                      >
                        <p className="text-xs font-bold text-white/90">{faq.q}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Navigation */}
            <div className="h-[60px] bg-[#1a1b26] border-t border-white/5 flex items-center justify-around px-2 relative z-20 shrink-0">
              <button 
                onClick={() => setActiveTab('home')}
                className={`flex flex-col items-center justify-center w-16 gap-1 transition-colors ${activeTab === 'home' ? 'text-yellow-500' : 'text-white/40 hover:text-white/60'}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                <span className="text-[10px] font-bold">Home</span>
              </button>
              <button 
                onClick={() => setActiveTab('messages')}
                className={`flex flex-col items-center justify-center w-16 gap-1 transition-colors ${activeTab === 'messages' ? 'text-blue-500' : 'text-white/40 hover:text-white/60'}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
                <span className="text-[10px] font-bold">Messages</span>
              </button>
              <button 
                onClick={() => setActiveTab('guides')}
                className={`flex flex-col items-center justify-center w-16 gap-1 transition-colors ${activeTab === 'guides' ? 'text-emerald-500' : 'text-white/40 hover:text-white/60'}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                <span className="text-[10px] font-bold">Guides</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hide the button completely when the mobile menu is open */}
      <div className={isMobileMenuOpen ? "hidden" : "block"}>
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] z-[99] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-shadow"
      >
        {isOpen ? <X className="w-6 h-6" /> : (
          <div className="relative">
            <MessageSquare className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[var(--bg-primary)] shadow-sm animate-bounce">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
        )}
      </motion.button>
      </div>
    </>
  );
}

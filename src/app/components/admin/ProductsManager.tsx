import { useState } from "react";
import { useProducts, Product } from "../../context/ProductContext";
import { useCurrency } from "../../context/CurrencyContext";
import { Plus, Edit2, Trash2, ArrowLeft, Tag, CheckCircle, XCircle, Users, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../../lib/api";

export function ProductsManager() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { formatPrice } = useCurrency();
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingDiscord, setIsFetchingDiscord] = useState(false);
  const [discordFetchError, setDiscordFetchError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Product>>({
    type: "account", title: "", level: 1, collectionRank: "Expert Collector", skins: 0, heroes: 0, price: 0, amount: 0,
    image: "", images: [], category: "starter", description: "",
    dedicatedId: "", tags: [], features: [], badge: undefined, featured: false,
    sellerName: "", sellerCategory: "Starter", sellerPhone: "", sellerId: undefined,
    sellerDiscordId: "", sellerDiscordUsername: "", sellerDiscordAvatar: ""
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const base64Promises = files.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    const base64Images = await Promise.all(base64Promises);

    setFormData(prev => {
      const newImages = [...(prev.images || []), ...base64Images];
      return {
        ...prev,
        images: newImages,
        image: prev.image || newImages[0] // Set primary image if none exists
      };
    });
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      let sellerId: string | undefined;

      if (formData.sellerName && (!formData.type || formData.type === "account")) {
        try {
          const sellerData = await api.createSellerAccount({
            name: formData.sellerName,
            category: formData.sellerCategory || "Starter",
            dedicatedId: formData.dedicatedId || undefined,
            phone: formData.sellerPhone || undefined,
            discordId: formData.sellerDiscordId || undefined,
            discordUsername: formData.sellerDiscordUsername || undefined,
            discordAvatar: formData.sellerDiscordAvatar || undefined,
            status: "active",
          });
          if (sellerData.success) {
            sellerId = sellerData.account.id;
            toast.success(`Seller account created for ${formData.sellerName}`);
          }
        } catch (err: any) {
          console.error("Failed to create seller account:", err);
          const errorMsg = err?.message || "Unknown error";
          if (errorMsg.includes("401") || errorMsg.includes("Unauthorized")) {
            toast.error("Admin session expired. Please refresh and login again.");
          } else if (errorMsg.includes("Failed to create seller account")) {
            toast.error("Server error: Seller account creation failed. Check if backend is running.");
          } else {
            toast.error(`Seller account error: ${errorMsg}`);
          }
        }
      }

      const newProduct = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      sellerId,
      stats: { totalMatches: 0, winRate: "0%", mvpCount: 0 }
    } as Product;

    addProduct(newProduct);

    const apiBase = import.meta.env.VITE_API_URL || "/api";
    const authHeader = localStorage.getItem("auth_token")
      ? { Authorization: `Bearer ${localStorage.getItem("auth_token")}` }
      : {};

    const isAccount = !newProduct.type || newProduct.type === "account";

    if (isAccount) {

    // Run Discord requests in parallel to speed up UI
    const forumPromise = fetch(`${apiBase}/tickets/forum-post`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader },
      body: JSON.stringify({
        product: {
          title: newProduct.title,
          dedicatedId: newProduct.dedicatedId,
          price: newProduct.discountPrice ?? newProduct.price,
          image: newProduct.image,
        }
      }),
    }).then(async res => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Unknown error');
      }
      const data = await res.json();
      updateProduct(newProduct.id, { discordThreadId: data.threadId });
      toast.success(`📋 Forum post created in #account-listing!`);
    }).catch(error => {
      console.error("Failed to create forum post:", error);
      toast.error(`Listed on site, but forum post failed.`);
    });

    const announcePromise = fetch(`${apiBase}/tickets/announce`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader },
      body: JSON.stringify({
        product: {
          title: newProduct.title,
          description: newProduct.description,
          price: newProduct.discountPrice ?? newProduct.price,
          level: newProduct.level,
          collectionRank: newProduct.collectionRank,
          skins: newProduct.skins,
          heroes: newProduct.heroes,
          image: newProduct.image,
        }
      }),
    }).then(async res => {
      if (!res.ok) throw new Error(`Announcement request failed (${res.status})`);
      toast.success(`📢 Announcement for ${newProduct.title} sent to Discord!`);
    }).catch(error => {
      console.error("Failed to announce:", error);
      toast.error(`Listing created, but failed to send Discord announcement.`);
    });

    await Promise.allSettled([forumPromise, announcePromise]);
    }
    } catch (error) {
      console.error("General error during submission:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
      setView("list");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (editingId) {
        if (formData.sellerName && (!formData.type || formData.type === "account")) {
          try {
            if (formData.sellerId) {
              await api.updateSellerAccount(formData.sellerId, {
                name: formData.sellerName,
                category: formData.sellerCategory || "Starter",
                dedicatedId: formData.dedicatedId || undefined,
                phone: formData.sellerPhone || undefined,
                discordId: formData.sellerDiscordId || undefined,
                discordUsername: formData.sellerDiscordUsername || undefined,
                discordAvatar: formData.sellerDiscordAvatar || undefined,
                status: "active",
              });
            } else {
              const sellerData = await api.createSellerAccount({
                name: formData.sellerName,
                category: formData.sellerCategory || "Starter",
                dedicatedId: formData.dedicatedId || undefined,
                phone: formData.sellerPhone || undefined,
                discordId: formData.sellerDiscordId || undefined,
                discordUsername: formData.sellerDiscordUsername || undefined,
                discordAvatar: formData.sellerDiscordAvatar || undefined,
                status: "active",
              });
              if (sellerData.success) {
                formData.sellerId = sellerData.account.id;
              }
            }
           } catch (err: any) {
             console.error("Failed to update seller account:", err);
             const errorMsg = err?.message || "Unknown error";
             if (errorMsg.includes("401") || errorMsg.includes("Unauthorized")) {
               toast.error("Admin session expired. Please refresh and login again.");
             } else {
               toast.error(`Seller account error: ${errorMsg}`);
             }
           }
        }

        updateProduct(editingId, formData);
        toast.success("Product updated successfully!");
        setView("list");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmId) {
      deleteProduct(deleteConfirmId);
      toast.success("Product deleted successfully!");
      setDeleteConfirmId(null);
    }
  };

  const startEdit = async (product: Product) => {
    const editData: any = { ...product };

    if (product.sellerId) {
      try {
        const sellerData = await api.getSellerAccount(product.sellerId);
        if (sellerData.success) {
          editData.sellerName = sellerData.account.name;
          editData.sellerCategory = sellerData.account.category;
          editData.sellerPhone = sellerData.account.phone || "";
          editData.sellerDiscordId = sellerData.account.discordId || "";
          editData.sellerDiscordUsername = sellerData.account.discordUsername || "";
          editData.sellerDiscordAvatar = sellerData.account.discordAvatar || "";
        }
      } catch (err) {
        console.error("Failed to fetch seller:", err);
      }
    } else {
      editData.sellerName = "";
      editData.sellerCategory = "Starter";
      editData.sellerPhone = "";
      editData.sellerDiscordId = "";
      editData.sellerDiscordUsername = "";
      editData.sellerDiscordAvatar = "";
    }

    setFormData(editData);
    setEditingId(product.id);
    setView("edit");
  };

  const handleMarkSold = async (product: Product) => {
    if (product.sellerId) {
      try {
        await api.updateSellerAccount(product.sellerId, { status: "sold" });
      } catch (err) {
        console.error("Failed to mark seller as sold:", err);
      }
    }

    if (!product.discordThreadId) {
      deleteProduct(product.id);
      toast.success(`${product.title} removed from listings.`);
      return;
    }

    const apiBase = import.meta.env.VITE_API_URL || "/api";
    const authHeader = localStorage.getItem("auth_token")
      ? { Authorization: `Bearer ${localStorage.getItem("auth_token")}` }
      : {};

    try {
      const res = await fetch(`${apiBase}/tickets/forum-sold`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify({ threadId: product.discordThreadId }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(`Failed to update Discord post: ${err.error || 'Unknown error'}`);
      } else {
        toast.success(`✅ Discord post marked as SOLD and closed!`);
      }
    } catch (error) {
      console.error("Failed to mark forum post as sold:", error);
      toast.error(`Could not update Discord. Removed from site only.`);
    }

    deleteProduct(product.id);
  };

  const handleMarkUnavailable = async (product: Product) => {
    if (product.sellerId) {
      try {
        await api.updateSellerAccount(product.sellerId, { status: "inactive" });
      } catch (err) {
        console.error("Failed to mark seller as inactive:", err);
      }
    }

    if (!product.discordThreadId) {
      deleteProduct(product.id);
      toast.success(`${product.title} removed from listings.`);
      return;
    }

    const apiBase = import.meta.env.VITE_API_URL || "/api";
    const authHeader = localStorage.getItem("auth_token")
      ? { Authorization: `Bearer ${localStorage.getItem("auth_token")}` }
      : {};

    try {
      const res = await fetch(`${apiBase}/tickets/forum-unavailable`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify({ threadId: product.discordThreadId }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(`Failed to update Discord post: ${err.error || 'Unknown error'}`);
      } else {
        toast.success(`⛔ Discord post marked as NOT AVAILABLE and closed!`);
      }
    } catch (error) {
      console.error("Failed to mark forum post as unavailable:", error);
      toast.error(`Could not update Discord. Removed from site only.`);
    }

    deleteProduct(product.id);
  };

  if (view === "add" || view === "edit") {
    return (
      <div className="space-y-6">
        <button onClick={() => setView("list")} className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </button>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-black text-[var(--text-primary)] mb-6">
            {view === "add" ? "List New Product" : "Edit Product"}
          </h2>
          <form onSubmit={view === "add" ? handleAddSubmit : handleEditSubmit} className="space-y-6">

            <div className="mb-6">
              <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Product Type</label>
              <div className="flex gap-4">
                {["account", "pubg-uc", "mlbb-diamonds"].map(type => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="productType" 
                      value={type} 
                      checked={(formData.type || "account") === type}
                      onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                      className="accent-[var(--accent)]"
                    />
                    <span className="text-sm font-bold text-[var(--text-primary)] capitalize">{type.replace('-', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Title</label>
                <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Dedicated ID (3 Letters)</label>
                <input type="text" maxLength={3} value={formData.dedicatedId || ""} onChange={e => setFormData({ ...formData, dedicatedId: e.target.value.toUpperCase() })} className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none" placeholder="e.g. ABC" />
              </div>
            </div>

            {(!formData.type || formData.type === "account") && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Price (Base)</label>
                  <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })} className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 text-[var(--accent)]">Discount Price</label>
                  <input type="number" step="0.01" value={formData.discountPrice || ""} onChange={e => setFormData({ ...formData, discountPrice: e.target.value ? parseFloat(e.target.value) : undefined })} className="w-full bg-[var(--bg-primary)] border border-[var(--accent)]/50 rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none" placeholder="Leave empty for no discount" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Category</label>
                  <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value as any })} className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none">
                    <option value="starter">Starter</option>
                    <option value="mid-tier">Mid-Tier</option>
                    <option value="premium">Premium</option>
                    <option value="collector">Collector</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Collection Rank</label>
                  <select value={formData.collectionRank} onChange={e => setFormData({ ...formData, collectionRank: e.target.value })} className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none">
                    <option value="Expert Collector">Expert Collector</option>
                    <option value="Renowned Collector">Renowned Collector</option>
                    <option value="Exalted Collector">Exalted Collector</option>
                    <option value="Mega Collector">Mega Collector</option>
                    <option value="World Collector">World Collector</option>
                    <option value="Galaxy Collector">Galaxy Collector</option>
                  </select>
                </div>
              </div>
            )}

            {formData.type && formData.type !== "account" && (
              <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-6 space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Currency Packages</label>
                  <button 
                    type="button"
                    onClick={() => {
                      const newPackages = [...(formData.currencyPackages || []), { id: Math.random().toString(36).substr(2, 9), amount: 0, price: 0 }];
                      setFormData({ ...formData, currencyPackages: newPackages, price: newPackages.length > 0 ? Math.min(...newPackages.map(p => p.price)) : 0 });
                    }}
                    className="text-xs font-bold text-[var(--accent)] bg-[var(--accent)]/10 px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-[var(--accent)]/20"
                  >
                    <Plus className="w-3 h-3" /> Add Package
                  </button>
                </div>
                
                {formData.currencyPackages?.map((pkg, idx) => (
                  <div key={pkg.id} className="flex items-center gap-4 bg-[var(--bg-secondary)] p-3 rounded-xl border border-[var(--border-color)]">
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-1">Amount</label>
                      <input type="number" required value={pkg.amount} onChange={e => {
                        const newPackages = [...formData.currencyPackages!];
                        newPackages[idx].amount = parseInt(e.target.value) || 0;
                        setFormData({ ...formData, currencyPackages: newPackages });
                      }} className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] outline-none" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-1">Price (NPR)</label>
                      <input type="number" step="0.01" required value={pkg.price} onChange={e => {
                        const newPackages = [...formData.currencyPackages!];
                        newPackages[idx].price = parseFloat(e.target.value) || 0;
                        setFormData({ ...formData, currencyPackages: newPackages, price: newPackages.length > 0 ? Math.min(...newPackages.map(p => p.price)) : 0 });
                      }} className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] outline-none" />
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        const newPackages = formData.currencyPackages!.filter((_, i) => i !== idx);
                        setFormData({ ...formData, currencyPackages: newPackages, price: newPackages.length > 0 ? Math.min(...newPackages.map(p => p.price)) : 0 });
                      }}
                      className="mt-5 p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {(!formData.currencyPackages || formData.currencyPackages.length === 0) && (
                  <p className="text-xs text-[var(--text-secondary)] text-center py-4">No packages added. Click 'Add Package' to create one.</p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {(!formData.type || formData.type === "account") && (
              <div className="md:col-span-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-[var(--accent)]" />
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Seller Information <span className="normal-case tracking-normal text-[var(--accent)]">(creates seller account)</span></label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Seller Name *</label>
                    <input type="text" value={formData.sellerName || ""} onChange={e => setFormData({ ...formData, sellerName: e.target.value })} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none" placeholder="e.g. John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Seller Discord UID *</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={formData.sellerDiscordId || ""} 
                        onChange={e => {
                          setFormData({ ...formData, sellerDiscordId: e.target.value });
                          setDiscordFetchError(null);
                        }}
                        className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none" 
                        placeholder="Paste Discord User ID..." 
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          const uid = formData.sellerDiscordId?.trim();
                          if (!uid || !/^\d+$/.test(uid)) {
                            setDiscordFetchError("Invalid Discord User ID format. Please enter a numeric user ID.");
                            return;
                          }
                           setIsFetchingDiscord(true);
                           setDiscordFetchError(null);
                           try {
                            const user = await api.getDiscordUser(uid);
                            setFormData(prev => ({
                              ...prev,
                              sellerDiscordUsername: user.username,
                              sellerDiscordAvatar: user.avatarUrl,
                            }));
                           } catch (err: any) {
                             console.error("Failed to fetch Discord user:", err);
                             const msg = err?.message || "Request failed";
                             if (msg.includes("not connected")) {
                               setDiscordFetchError("Discord bot is not connected. Please contact support.");
                             } else if (msg.includes("not found") || msg.includes("cannot access")) {
                               setDiscordFetchError("User not found or the bot cannot access this user.");
                             } else if (msg.includes("Request failed") || msg.includes("Failed to fetch")) {
                               setDiscordFetchError("Cannot reach server. Check your connection or API configuration.");
                             } else {
                               setDiscordFetchError(msg);
                             }
                           } finally {
                            setIsFetchingDiscord(false);
                          }
                        }}
                        className="px-4 py-3 rounded-xl text-sm font-bold border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-colors disabled:opacity-50"
                        disabled={isFetchingDiscord}
                      >
                        {isFetchingDiscord ? <Loader2 className="w-4 h-4 animate-spin" /> : "Fetch"}
                      </button>
                    </div>
                    {discordFetchError && (
                      <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {discordFetchError}
                      </p>
                    )}
                    {formData.sellerDiscordUsername && !discordFetchError && (
                      <div className="flex items-center gap-2 mt-2">
                        <img 
                          src={formData.sellerDiscordAvatar} 
                          alt="" 
                          className="w-6 h-6 rounded-full border border-[var(--border-color)] object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <span className="text-xs font-bold text-[var(--accent)]">{formData.sellerDiscordUsername}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Phone <span className="normal-case tracking-normal">(optional)</span></label>
                    <input type="tel" value={formData.sellerPhone || ""} onChange={e => setFormData({ ...formData, sellerPhone: e.target.value })} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none" placeholder="+977 98XXXXXXXX" />
                  </div>
                </div>
              </div>
            )}
              <>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Level</label>
                  <input type="number" required value={formData.level} onChange={e => setFormData({ ...formData, level: parseInt(e.target.value) })} className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Skins</label>
                  <input type="number" required value={formData.skins} onChange={e => setFormData({ ...formData, skins: parseInt(e.target.value) })} className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Heroes</label>
                  <input type="number" required value={formData.heroes} onChange={e => setFormData({ ...formData, heroes: parseInt(e.target.value) })} className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none" />
                </div>
              </>
              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Custom Badge</label>
                <input
                  type="text"
                  value={formData.badge || ""}
                  onChange={e => setFormData({ ...formData, badge: e.target.value })}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none"
                  placeholder="e.g. Premium, Hot"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featuredToggle"
                  checked={!!formData.featured}
                  onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-5 h-5 accent-[var(--accent)] cursor-pointer shrink-0"
                />
                <label htmlFor="featuredToggle" className="text-sm font-bold text-[var(--text-primary)] cursor-pointer select-none">
                  Mark as Featured Product
                </label>
              </div>
              <span className="text-xs text-[var(--text-secondary)] sm:ml-2">(Featured products appear in a dedicated slider on the home page)</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Description</label>
              <textarea rows={3} required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none"></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Product Images</label>
              <div className="flex flex-col gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full text-sm text-[var(--text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[var(--accent)]/10 file:text-[var(--accent)] hover:file:bg-[var(--accent)]/20 transition-colors"
                  />
                  <p className="text-xs text-[var(--text-secondary)] mt-2">Upload multiple high quality images. The first image will be the primary thumbnail.</p>
                </div>

                {/* Images Preview Grid */}
                {(formData.images?.length || formData.image) ? (
                  <div className="flex flex-wrap gap-4 mt-2">
                    {/* Render primary image if images array is empty but primary exists (legacy support) */}
                    {(!formData.images || formData.images.length === 0) && formData.image && (
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-[var(--bg-primary)] border-2 border-[var(--accent)] relative group">
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute top-1 left-1 bg-[var(--accent)] text-white text-[8px] font-bold px-2 py-0.5 rounded-full">Primary</div>
                      </div>
                    )}
                    {formData.images?.map((img, index) => (
                      <div key={index} className={`w-24 h-24 rounded-xl overflow-hidden bg-[var(--bg-primary)] relative group ${index === 0 ? 'border-2 border-[var(--accent)]' : 'border border-[var(--border-color)]'}`}>
                        <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                        {index === 0 && <div className="absolute top-1 left-1 bg-[var(--accent)] text-white text-[8px] font-bold px-2 py-0.5 rounded-full">Primary</div>}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => {
                              const newImages = prev.images?.filter((_, i) => i !== index) || [];
                              return { ...prev, images: newImages, image: newImages[0] || "" };
                            });
                          }}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-full h-24 rounded-xl border border-dashed border-[var(--border-color)] flex items-center justify-center">
                    <span className="text-xs text-[var(--text-secondary)]">No Images Uploaded</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white px-8 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  view === "add" ? "Create Listing & Announce" : "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-primary)]">Products Manager</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage marketplace listings, discounts, and tags.</p>
        </div>
        <button
          onClick={() => {
          setFormData({
            title: "", level: 1, collectionRank: "Expert Collector", skins: 0, heroes: 0, price: 0,
            image: "", images: [], category: "starter", description: "", currencyPackages: [],
            dedicatedId: "", tags: [], features: [], badge: undefined, featured: false,
            sellerName: "", sellerCategory: "Starter", sellerPhone: "", sellerId: undefined,
            sellerDiscordId: "", sellerDiscordUsername: "", sellerDiscordAvatar: ""
          });
            setView("add");
          }}
          className="bg-[var(--text-primary)] text-[var(--bg-primary)] hover:bg-[var(--text-secondary)] flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold shadow-md transition-colors w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--bg-primary)] border-b border-[var(--border-color)] text-[var(--text-secondary)] text-xs uppercase tracking-widest">
                <th className="p-4 font-bold">Admin ID</th>
                <th className="p-4 font-bold">Product Title</th>
                <th className="p-4 font-bold">Price</th>
                <th className="p-4 font-bold">Seller</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-[var(--bg-primary)] transition-colors">
                  <td className="p-4">
                    <span className="bg-[var(--accent)]/10 text-[var(--accent)] px-2 py-1 rounded text-xs font-black tracking-widest border border-[var(--accent)]/20">
                      {product.dedicatedId || "N/A"}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-bold text-[var(--text-primary)]">{product.title}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="flex items-center gap-1 text-[10px] text-[var(--text-primary)] bg-[var(--border-color)] px-1.5 py-0.5 rounded font-bold uppercase">
                        {(product.type || "account").replace('-', ' ')}
                      </span>
                      {product.tags?.map(tag => (
                        <span key={tag} className="flex items-center gap-1 text-[10px] text-[var(--text-secondary)] bg-[var(--bg-secondary)] border border-[var(--border-color)] px-1.5 py-0.5 rounded">
                          <Tag className="w-2.5 h-2.5" /> {tag}
                        </span>
                      ))}
                      {product.featured && (
                        <span className="flex items-center gap-1 text-[10px] text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 px-1.5 py-0.5 rounded font-bold">
                          ★ Featured
                        </span>
                      )}
                      {product.badge && (
                        <span className="flex items-center gap-1 text-[10px] text-white bg-red-500 px-1.5 py-0.5 rounded font-bold">
                          {product.badge}
                        </span>
                      )}
                    </div>
                  </td>
                   <td className="p-4">
                     {product.type && product.type !== "account" && product.currencyPackages && product.currencyPackages.length > 0 ? (
                       <div>
                         <p className="text-sm font-bold text-[var(--text-primary)]">From {formatPrice(Math.min(...product.currencyPackages.map(p => p.price)))}</p>
                         <p className="text-xs text-[var(--text-secondary)]">{product.currencyPackages.length} Packages</p>
                       </div>
                     ) : product.discountPrice ? (
                       <div>
                         <p className="text-sm font-bold text-[var(--accent)]">{formatPrice(product.discountPrice)}</p>
                         <p className="text-xs text-[var(--text-secondary)] line-through">{formatPrice(product.price)}</p>
                       </div>
                     ) : (
                       <p className="text-sm font-bold text-[var(--text-primary)]">{formatPrice(product.price)}</p>
                     )}
                   </td>
                    <td className="p-4 text-sm">
                      {product.sellerId && product.sellerName ? (
                        <div>
                          <p className="text-sm font-bold text-[var(--text-primary)]">{product.sellerName}</p>
                          {product.sellerCategory && (
                            <p className="text-xs text-[var(--text-secondary)]">{product.sellerCategory}</p>
                          )}
                        </div>
                      ) : product.sellerId ? (
                        <span className="text-xs font-bold text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-1 rounded-lg border border-[var(--accent)]/20">Linked</span>
                      ) : (
                        <span className="text-[var(--text-secondary)]/40">—</span>
                      )}
                    </td>
                   <td className="p-4">
                    <span className="text-xs font-bold text-green-500 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Active
                    </span>
                  </td>
                  <td className="p-4 flex justify-end gap-2">
                    <button onClick={() => startEdit(product)} className="p-2 text-[var(--text-secondary)] hover:text-blue-400 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg transition-colors" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMarkSold(product)}
                      className="p-2 text-[var(--text-secondary)] hover:text-green-400 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg transition-colors"
                      title="Mark as Sold"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMarkUnavailable(product)}
                      className="p-2 text-[var(--text-secondary)] hover:text-orange-400 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg transition-colors"
                      title="Mark as Not Available"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteConfirmId(product.id)} className="p-2 text-[var(--text-secondary)] hover:text-red-500 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-black text-[var(--text-primary)] mb-2">Delete Product?</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-6">Are you sure you want to permanently delete this product? This action cannot be undone.</p>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-colors border border-transparent hover:border-[var(--border-color)]"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

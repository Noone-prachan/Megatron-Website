import { useState } from "react";
import { useProducts, Product } from "../../context/ProductContext";
import { useCurrency } from "../../context/CurrencyContext";
import { Plus, Edit2, Trash2, ArrowLeft, Tag } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../../lib/api";

export function ProductsManager() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { formatPrice } = useCurrency();
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Product>>({
    title: "", level: 1, collectionRank: "Expert Collector", skins: 0, heroes: 0, price: 0,
    image: "", images: [], category: "starter", description: "",
    dedicatedId: "", tags: [], features: [], badge: undefined, featured: false
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
    const newProduct = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      stats: { totalMatches: 0, winRate: "0%", mvpCount: 0 }
    } as Product;

    addProduct(newProduct);

    // Call backend to send Discord announcement
    try {
      // ApiClient currently exposes typed methods; use fetch for this custom endpoint.
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3001/api"}/tickets/announce`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(localStorage.getItem("auth_token")
            ? { Authorization: `Bearer ${localStorage.getItem("auth_token")}` }
            : {}),
        },
        body: JSON.stringify({ product: newProduct }),
      });

      if (!res.ok) throw new Error(`Announcement request failed (${res.status})`);

      toast.success(`Announcement for ${newProduct.title} sent to Discord!`);
    } catch (error) {
      console.error("Failed to announce:", error);
      toast.error(`Listing created, but failed to send Discord announcement.`);
    }

    setView("list");
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateProduct(editingId, formData);
      toast.success("Product updated successfully!");
      setView("list");
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmId) {
      deleteProduct(deleteConfirmId);
      toast.success("Product deleted successfully!");
      setDeleteConfirmId(null);
    }
  };

  const startEdit = (product: Product) => {
    setFormData(product);
    setEditingId(product.id);
    setView("edit");
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
              <button type="submit" className="bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white px-8 py-3 rounded-xl font-bold transition-colors">
                {view === "add" ? "Create Listing & Announce" : "Save Changes"}
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
              image: "", images: [], category: "starter", description: "",
              dedicatedId: "", tags: [], features: [], badge: undefined, featured: false
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
                    {product.discountPrice ? (
                      <div>
                        <p className="text-sm font-bold text-[var(--accent)]">{formatPrice(product.discountPrice)}</p>
                        <p className="text-xs text-[var(--text-secondary)] line-through">{formatPrice(product.price)}</p>
                      </div>
                    ) : (
                      <p className="text-sm font-bold text-[var(--text-primary)]">{formatPrice(product.price)}</p>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-bold text-green-500 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Active
                    </span>
                  </td>
                  <td className="p-4 flex justify-end gap-2">
                    <button onClick={() => startEdit(product)} className="p-2 text-[var(--text-secondary)] hover:text-blue-400 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteConfirmId(product.id)} className="p-2 text-[var(--text-secondary)] hover:text-red-500 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg transition-colors">
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

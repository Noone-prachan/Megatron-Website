import { Users, CreditCard, Activity, MousePointerClick, Star } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { useHistory } from "../../context/HistoryContext";
import { useCurrency } from "../../context/CurrencyContext";
import { useProducts } from "../../context/ProductContext";
import { useReviews } from "../../context/ReviewContext";
import { useMemo, useEffect, useState } from "react";
import { api } from "../../../lib/api";

export function AnalyticsPage() {
  const { transactions } = useHistory();
  const { formatPrice } = useCurrency();
  const { products } = useProducts();
  const { reviews } = useReviews();

  const [visitsData, setVisitsData] = useState<Record<string, number>>({});

  useEffect(() => {
    api.getVisits().then(data => {
      setVisitsData(data);
    }).catch(console.error);
  }, []);

  // Process transactions into chart data
  const data = useMemo(() => {
    // Group transactions by date
    const grouped = transactions.reduce((acc, tx) => {
      // Just extract Day/Month for simplicity (e.g. "May 28")
      const date = new Date(tx.date);
      const name = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const dateKey = date.toISOString().split('T')[0]; // For looking up visits
      
      if (!acc[name]) acc[name] = { name, dateKey, revenue: 0, visits: 0 };
      acc[name].revenue += tx.price;
      return acc;
    }, {} as Record<string, any>);
    
    // Add missing days that might have visits but no transactions
    Object.keys(visitsData).forEach(dateKey => {
      const date = new Date(dateKey);
      const name = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (!grouped[name]) {
        grouped[name] = { name, dateKey, revenue: 0, visits: 0 };
      }
    });

    // Populate actual visits
    Object.values(grouped).forEach(item => {
      item.visits = visitsData[item.dateKey] || 0;
    });

    // Convert back to array and sort by date chronologically
    return Object.values(grouped).sort((a, b) => {
       const dateA = new Date(a.dateKey);
       const dateB = new Date(b.dateKey);
       return dateA.getTime() - dateB.getTime();
    });
  }, [transactions, visitsData]);

  const totalRevenue = transactions.reduce((sum, tx) => sum + tx.price, 0);
  const avgOrder = transactions.length > 0 ? totalRevenue / transactions.length : 0;

  const metrics = [
    { label: "Sold Accounts", value: transactions.length.toString(), change: "+12%", icon: CreditCard, color: "text-green-500" },
    { label: "Total Revenue", value: formatPrice(totalRevenue), change: "+5%", icon: Activity, color: "text-blue-500" },
    { label: "Active Listings", value: products.length.toString(), change: "Live", icon: Users, color: "text-purple-500" },
    { label: "Avg Order Value", value: formatPrice(avgOrder), change: "+8%", icon: MousePointerClick, color: "text-orange-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-[var(--text-primary)]">Analytics Overview</h1>
        <p className="text-[var(--text-secondary)] mt-1">Welcome back. Here's what's happening with the marketplace today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] ${metric.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                  {metric.change}
                </span>
              </div>
              <h3 className="text-[var(--text-secondary)] text-sm font-bold uppercase tracking-wider mb-1">{metric.label}</h3>
              <p className="text-3xl font-black text-[var(--text-primary)]">{metric.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
          <h3 className="text-[var(--text-primary)] font-bold mb-6">Revenue Over Time</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '0.75rem', color: 'var(--text-primary)' }}
                  itemStyle={{ color: 'var(--accent)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="var(--accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
          <h3 className="text-[var(--text-primary)] font-bold mb-6">Web Visits vs Revenue</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '0.75rem', color: 'var(--text-primary)' }}
                  cursor={{ fill: 'var(--bg-primary)' }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="visits" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Web Visits" />
                <Bar yAxisId="right" dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="Revenue ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
        <h3 className="text-[var(--text-primary)] font-bold mb-6 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" /> Recent Reviews
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-color)] text-[var(--text-secondary)] text-xs uppercase tracking-widest">
                <th className="pb-4 font-bold">User</th>
                <th className="pb-4 font-bold">Rating</th>
                <th className="pb-4 font-bold">Comment</th>
                <th className="pb-4 font-bold text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {reviews.slice(0, 5).map((review) => (
                <tr key={review.id} className="hover:bg-[var(--bg-primary)] transition-colors">
                  <td className="py-4 pr-4">
                    <p className="text-sm font-bold text-[var(--text-primary)]">{review.name}</p>
                    {review.verified && <span className="text-[10px] text-green-500 uppercase tracking-widest font-bold">Verified Buyer</span>}
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "fill-current" : "text-[var(--border-color)]"}`} />
                      ))}
                    </div>
                  </td>
                  <td className="py-4 pr-4">
                    <p className="text-sm text-[var(--text-secondary)] truncate max-w-sm">{review.comment}</p>
                  </td>
                  <td className="py-4 text-right">
                    <span className="text-xs text-[var(--text-secondary)]">{review.date}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

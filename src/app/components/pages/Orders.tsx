import { useOrders } from '../../context/OrderContext';

export function Orders() {
  const { orders } = useOrders();
  const userId = localStorage.getItem("discord_id");
  const userOrders = orders.filter(order => order.userId === userId);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-[var(--bg-secondary)] border border-[var(--border-color)]">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-[var(--border-color)] text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 border-b-2 border-[var(--border-color)] text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 border-b-2 border-[var(--border-color)] text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {userOrders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap border-b border-[var(--border-color)]">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap border-b border-[var(--border-color)]">{order.product.title}</td>
                <td className="px-6 py-4 whitespace-nowrap border-b border-[var(--border-color)]">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    order.status === 'Unverified' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'Sold' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
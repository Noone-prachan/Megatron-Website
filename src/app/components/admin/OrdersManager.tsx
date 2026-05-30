import { useOrders } from '../../context/OrderContext';

export function OrdersManager() {
  const { orders, updateOrderStatus } = useOrders();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Order Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-[var(--bg-secondary)] border border-[var(--border-color)]">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-[var(--border-color)] text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 border-b-2 border-[var(--border-color)] text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 border-b-2 border-[var(--border-color)] text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">User ID</th>
              <th className="px-6 py-3 border-b-2 border-[var(--border-color)] text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 border-b-2 border-[var(--border-color)] text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap border-b border-[var(--border-color)]">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap border-b border-[var(--border-color)]">{order.product.title}</td>
                <td className="px-6 py-4 whitespace-nowrap border-b border-[var(--border-color)]">{order.userId}</td>
                <td className="px-6 py-4 whitespace-nowrap border-b border-[var(--border-color)]">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    order.status === 'Unverified' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'Sold' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap border-b border-[var(--border-color)] text-sm font-medium">
                  {order.status === 'Unverified' && (
                    <>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Sold')}
                        className="text-green-600 hover:text-green-900"
                      >
                        Mark as Sold
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Cancelled')}
                        className="text-red-600 hover:text-red-900 ml-4"
                      >
                        Mark as Cancelled
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
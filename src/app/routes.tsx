import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./components/pages/Home";
import { Products } from "./components/pages/Products";
import { ProductDetail } from "./components/pages/ProductDetail";
import { Reviews } from "./components/pages/Reviews";
import { Team } from "./components/pages/Team";
import { Orders } from "./components/pages/Orders";
import { AuthCallback } from "./components/pages/AuthCallback";
import { NotFound } from "./components/pages/NotFound";
import { AdminGuard } from "./components/admin/AdminGuard";
import { AdminLayout } from "./components/admin/AdminLayout";
import { AnalyticsPage } from "./components/admin/AnalyticsPage";
import { ProductsManager } from "./components/admin/ProductsManager";
import { OrdersManager } from "./components/admin/OrdersManager";
import { HistoryPage } from "./components/admin/HistoryPage";
import { AnnouncementManager } from "./components/admin/AnnouncementManager";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "products", Component: Products },
      { path: "products/:id", Component: ProductDetail },
      { path: "reviews", Component: Reviews },
      { path: "team", Component: Team },
      { path: "orders", Component: Orders },
      { path: "auth/discord/callback", Component: AuthCallback },
      { path: "auth/success", Component: AuthCallback },
      { path: "auth/error", Component: AuthCallback },
    ],
  },
  {
    path: "/admin",
    Component: AdminGuard,
    children: [
      {
        path: "",
        Component: AdminLayout,
        children: [
          { index: true, Component: AnalyticsPage },
          { path: "products", Component: ProductsManager },
          { path: "orders", Component: OrdersManager },
          { path: "history", Component: HistoryPage },
          { path: "announcement", Component: AnnouncementManager },
        ],
      },
    ],
  },
  { path: "*", Component: NotFound }
]);
import { createBrowserRouter } from "react-router-dom";
import { Root } from "./components/Root";
import { Home } from "./components/pages/Home";
import { Products } from "./components/pages/Products";
import { ProductDetail } from "./components/pages/ProductDetail";
import { Reviews } from "./components/pages/Reviews";
import { Team } from "./components/pages/Team";
import { Orders } from "./components/pages/Orders";
import { AuthCallback } from "./components/pages/AuthCallback";
import { NotFound } from "./components/pages/NotFound";
import { FAQ } from "./components/pages/FAQ";
import { Privacy } from "./components/pages/Privacy";
import { Terms } from "./components/pages/Terms";
import { Refund } from "./components/pages/Refund";
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
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "products", element: <Products /> },
      { path: "products/:id", element: <ProductDetail /> },
      { path: "reviews", element: <Reviews /> },
      { path: "team", element: <Team /> },
      { path: "orders", element: <Orders /> },
      { path: "faq", element: <FAQ /> },
      { path: "privacy", element: <Privacy /> },
      { path: "terms", element: <Terms /> },
      { path: "refund", element: <Refund /> },
      { path: "auth/discord/callback", element: <AuthCallback /> },
      { path: "auth/success", element: <AuthCallback /> },
      { path: "auth/error", element: <AuthCallback /> },
    ],
  },
  {
    element: <AdminGuard />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <AnalyticsPage /> },
          { path: "products", element: <ProductsManager /> },
          { path: "orders", element: <OrdersManager /> },
          { path: "history", element: <HistoryPage /> },
          { path: "announcement", element: <AnnouncementManager /> },
        ],
      },
    ],
  },
  { path: "*", element: <NotFound /> }
]);
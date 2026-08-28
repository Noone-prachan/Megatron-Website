import { createBrowserRouter } from "react-router-dom";
import { Root } from "./components/Root";
import { NotFound } from "./components/pages/NotFound";
import { AdminGuard } from "./components/admin/AdminGuard";
import React from "react";

const Home = React.lazy(() => import("./components/pages/Home").then(m => ({ default: m.Home })));
const Products = React.lazy(() => import("./components/pages/Products").then(m => ({ default: m.Products })));
const Accounts = React.lazy(() => import("./components/pages/Accounts").then(m => ({ default: m.Accounts })));
const ProductDetail = React.lazy(() => import("./components/pages/ProductDetail").then(m => ({ default: m.ProductDetail })));
const Reviews = React.lazy(() => import("./components/pages/Reviews").then(m => ({ default: m.Reviews })));
const Team = React.lazy(() => import("./components/pages/Team").then(m => ({ default: m.Team })));
const Orders = React.lazy(() => import("./components/pages/Orders").then(m => ({ default: m.Orders })));
const Wishlist = React.lazy(() => import("./components/pages/Wishlist").then(m => ({ default: m.Wishlist })));
const AuthCallback = React.lazy(() => import("./components/pages/AuthCallback").then(m => ({ default: m.AuthCallback })));
const FAQ = React.lazy(() => import("./components/pages/FAQ").then(m => ({ default: m.FAQ })));
const Privacy = React.lazy(() => import("./components/pages/Privacy").then(m => ({ default: m.Privacy })));
const Terms = React.lazy(() => import("./components/pages/Terms").then(m => ({ default: m.Terms })));
const Refund = React.lazy(() => import("./components/pages/Refund").then(m => ({ default: m.Refund })));

const AdminLayout = React.lazy(() => import("./components/admin/AdminLayout").then(m => ({ default: m.AdminLayout })));
const AnalyticsPage = React.lazy(() => import("./components/admin/AnalyticsPage").then(m => ({ default: m.AnalyticsPage })));
const ProductsManager = React.lazy(() => import("./components/admin/ProductsManager").then(m => ({ default: m.ProductsManager })));
const OrdersManager = React.lazy(() => import("./components/admin/OrdersManager").then(m => ({ default: m.OrdersManager })));
const HistoryPage = React.lazy(() => import("./components/admin/HistoryPage").then(m => ({ default: m.HistoryPage })));
const AnnouncementManager = React.lazy(() => import("./components/admin/AnnouncementManager").then(m => ({ default: m.AnnouncementManager })));
const SecurityPage = React.lazy(() => import("./components/admin/SecurityPage").then(m => ({ default: m.SecurityPage })));
const PopupManager = React.lazy(() => import("./components/admin/PopupManager").then(m => ({ default: m.PopupManager })));
const SeoPage = React.lazy(() => import("./components/admin/SeoPage").then(m => ({ default: m.SeoPage })));
const SellerAccountsPage = React.lazy(() => import("./components/admin/SellerAccountsPage").then(m => ({ default: m.SellerAccountsPage })));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "accounts", element: <Accounts /> },
      { path: "accounts/:id", element: <ProductDetail /> },
      { path: "products", element: <Products /> },
      { path: "products/:id", element: <ProductDetail /> },
      { path: "reviews", element: <Reviews /> },
      { path: "team", element: <Team /> },
      { path: "orders", element: <Orders /> },
      { path: "wishlist", element: <Wishlist /> },
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
          { path: "sellers", element: <SellerAccountsPage /> },
          { path: "announcement", element: <AnnouncementManager /> },
          { path: "popups", element: <PopupManager /> },
          { path: "history", element: <HistoryPage /> },
          { path: "security", element: <SecurityPage /> },
          { path: "seo", element: <SeoPage /> },
        ],
      },
    ],
  },
  { path: "*", element: <NotFound /> }
]);
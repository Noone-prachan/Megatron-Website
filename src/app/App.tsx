import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { api } from "../lib/api";
import { CurrencyProvider } from "./context/CurrencyContext";
import { ProductProvider } from "./context/ProductContext";
import { AnnouncementProvider } from "./context/AnnouncementContext";
import { ThemeProvider } from "./context/ThemeContext";
import { HistoryProvider } from "./context/HistoryContext";
import { ReviewProvider } from "./context/ReviewContext";
import { OrderProvider } from "./context/OrderContext";
import { Toaster } from "sonner";
import { HelmetProvider } from "react-helmet-async";
import { WishlistProvider } from "./context/WishlistContext";
import { AdminProvider } from "./context/AdminContext";
import { SeoProvider } from "./context/SeoContext";

export default function App() {
  useEffect(() => {
    // Record web visit on app load
    api.recordVisit().catch(console.error);
  }, []);

  return (
    <HelmetProvider>
      <ThemeProvider>
      <CurrencyProvider>
        <ProductProvider>
          <AnnouncementProvider>
            <HistoryProvider>
              <ReviewProvider>
                <OrderProvider>
                  <WishlistProvider>
                    <AdminProvider>
                      <SeoProvider>
                        <Toaster theme="dark" position="bottom-left" richColors />
                        <RouterProvider router={router} />
                      </SeoProvider>
                    </AdminProvider>
                  </WishlistProvider>
                </OrderProvider>
              </ReviewProvider>
            </HistoryProvider>
          </AnnouncementProvider>
        </ProductProvider>
      </CurrencyProvider>
    </ThemeProvider>
    </HelmetProvider>
  );
}
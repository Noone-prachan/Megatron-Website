import { RouterProvider } from "react-router";
import { router } from "./routes";
import { CurrencyProvider } from "./context/CurrencyContext";
import { ProductProvider } from "./context/ProductContext";
import { AnnouncementProvider } from "./context/AnnouncementContext";
import { ThemeProvider } from "./context/ThemeContext";
import { HistoryProvider } from "./context/HistoryContext";
import { ReviewProvider } from "./context/ReviewContext";
import { OrderProvider } from "./context/OrderContext";
import { Toaster } from "sonner";

export default function App() {
  return (
    <ThemeProvider>
      <Toaster theme="dark" position="bottom-right" richColors />
      <AnnouncementProvider>
        <ProductProvider>
          <HistoryProvider>
            <ReviewProvider>
              <CurrencyProvider>
                <OrderProvider>
                  <RouterProvider router={router} />
                </OrderProvider>
              </CurrencyProvider>
            </ReviewProvider>
          </HistoryProvider>
        </ProductProvider>
      </AnnouncementProvider>
    </ThemeProvider>
  );
}
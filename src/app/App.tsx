import { RouterProvider } from "react-router-dom";
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
      <CurrencyProvider>
        <ProductProvider>
          <AnnouncementProvider>
            <HistoryProvider>
              <ReviewProvider>
                <OrderProvider>
                  <Toaster theme="dark" position="bottom-right" richColors />
                  <RouterProvider router={router} />
                </OrderProvider>
              </ReviewProvider>
            </HistoryProvider>
          </AnnouncementProvider>
        </ProductProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}
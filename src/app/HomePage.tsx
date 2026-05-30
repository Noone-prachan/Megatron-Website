import Hero from "./components/Hero";
import Features from "./components/Features";
import CTA from "./components/CTA";
import ProductList from "./components/ProductList";

export default function HomePage() {
  return (
    <div className="bg-gray-900">
      <Hero />
      <ProductList />
      <Features />
      <CTA />
    </div>
  );
}
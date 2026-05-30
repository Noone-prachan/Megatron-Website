import ProductCard, { Product } from "./ProductCard";

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Mythic Glory Account",
    level: 78,
    rank: "Mythic Glory",
    skins: 250,
    heroes: 110,
    price: 499.99,
    image: "https://via.placeholder.com/300x200.png?text=Account+1",
    isHot: true,
    isNew: false,
  },
  {
    id: 2,
    name: "Epic Collector",
    level: 65,
    rank: "Mythic",
    skins: 180,
    heroes: 95,
    price: 249.99,
    image: "https://via.placeholder.com/300x200.png?text=Account+2",
    isHot: false,
    isNew: true,
  },
  {
    id: 3,
    name: "Legendary Starter",
    level: 50,
    rank: "Legend",
    skins: 80,
    heroes: 70,
    price: 99.99,
    image: "https://via.placeholder.com/300x200.png?text=Account+3",
    isHot: false,
    isNew: false,
  },
];

export default function ProductList() {
  return (
    <div className="bg-gray-900 py-20">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          Featured Accounts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
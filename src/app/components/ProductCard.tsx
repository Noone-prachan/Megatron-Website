export interface Product {
  id: number;
  name: string;
  level: number;
  rank: string;
  skins: number;
  heroes: number;
  price: number;
  image: string;
  isHot: boolean;
  isNew: boolean;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="relative bg-gray-800 rounded-2xl overflow-hidden shadow-lg transform transition-all duration-400 hover:-translate-y-3 hover:shadow-2xl">
      <div className="relative w-full h-72 overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        {/* Badges */}
        {(product.isHot || product.isNew) && (
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {product.isHot && (
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">HOT</span>
            )}
            {product.isNew && (
              <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">NEW</span>
            )}
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3">{product.name}</h3>
        <div className="flex justify-between text-gray-300 text-sm md:text-base mb-3">
          <span>Level: <strong className="text-white">{product.level}</strong></span>
          <span>Rank: <strong className="text-white">{product.rank}</strong></span>
        </div>
        <div className="flex justify-between text-gray-300 text-sm md:text-base mb-4">
          <span>Skins: <strong className="text-white">{product.skins}</strong></span>
          <span>Heroes: <strong className="text-white">{product.heroes}</strong></span>
        </div>
        <div className="text-3xl md:text-4xl font-black text-white text-center">${product.price}</div>
        <button className="w-full mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-transform hover:scale-105">
          View Details
        </button>
      </div>
    </div>
  );
}
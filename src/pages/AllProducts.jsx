import React, { useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

const AllProducts = () => {
  const { products } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => p?.inStock)
      .filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.category || '').toLowerCase().includes(searchQuery.toLowerCase()),
      );
  }, [products, searchQuery]);

  return (
    <div className="mt-16 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 w-full">
      <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <p className="text-2xl font-semibold md:text-3xl uppercase text-gray-800">
            Product Catalog
          </p>
          <div className="w-16 h-1 bg-primary mt-1 rounded-full" />
        </div>

        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products"
          className="border border-gray-300 rounded-md px-3 py-2 w-full md:w-80"
        />
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllProducts;

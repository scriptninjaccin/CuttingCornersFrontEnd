import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AllProducts = () => {
  const { category } = useParams(); // 👈 category from URL
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${API_BASE_URL}/products/${category}`
        );

        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => !p.isDeleted)
      .filter(p => p.stock > 0)
      .filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [products, searchQuery]);

  if (loading) {
    return <p className="text-center mt-10">Loading products...</p>;
  }

  return (
    <div className="mt-16 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 w-full">
      <div className="mb-6">
        <p className="text-2xl font-semibold md:text-3xl uppercase text-gray-800">
          {category} Products
        </p>
        <div className="w-16 h-1 bg-primary mt-1 rounded-full" />
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          No products found.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.productId}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllProducts;

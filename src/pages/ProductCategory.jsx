import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import { categories } from "../assets/assets";

const ProductCategory = () => {
  const { category } = useParams(); // category from URL
  const { axios } = useAppContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products by category from backend
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/products/${category}`);
        setProducts(data.items || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [category, axios]);

  // Get category display info
  const searchCategory = categories.find(
    (c) => c.path.toLowerCase() === category.toLowerCase()
  );

  return (
    <div className="mt-16 px-3 md:px-6">
      {/* Category Header */}
      {searchCategory && (
        <div className="flex flex-col items-end w-max">
          <p className="text-2xl font-medium uppercase">{searchCategory.text}</p>
          <div className="w-16 h-0.5 bg-primary rounded-full my-2"></div>
        </div>
      )}

      {/* Loader */}
      {loading && (
        <div className="flex justify-center items-center mt-10">
          <p className="text-lg text-gray-500">Loading products...</p>
        </div>
      )}

      {/* No products */}
      {!loading && products.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-10">
          <p className="text-lg font-semibold text-gray-600">
            No products available in {category}.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Please explore other categories or check back later!
          </p>
        </div>
      )}

      {/* Product Grid */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 mt-6">
          {products.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCategory;

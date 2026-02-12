import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { categories } from "../assets/assets";
import { getCategoryCandidates } from "../utils/categoryMap";

const extractProducts = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.data?.items)) return data.data.items;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const ProductCategory = () => {
  const { category } = useParams();
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (!category) {
        setCategoryProducts([]);
        return;
      }

      setLoading(true);

      try {
        const categoryCandidates = getCategoryCandidates(category);
        let fetchedProducts = [];

        for (const candidate of categoryCandidates) {
          try {
            const { data } = await axios.get(
              `/products/${encodeURIComponent(candidate)}`,
            );
            const products = extractProducts(data).filter((item) => item?.inStock !== false);

            if (products.length > 0) {
              fetchedProducts = products;
              break;
            }

            if (fetchedProducts.length === 0) {
              fetchedProducts = products;
            }
          } catch {
            // Try next category candidate.
          }
        }

        setCategoryProducts(fetchedProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [category]);

  const searchCategory = categories.find(
    (c) => c.path.toLowerCase() === category?.toLowerCase(),
  );

  return (
    <div className="mt-16 px-3 md:px-6">
      {searchCategory && (
        <div className="flex flex-col items-end w-max">
          <p className="text-2xl font-medium uppercase">{searchCategory.text}</p>
          <div className="w-16 h-0.5 bg-primary rounded-full my-2"></div>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center mt-10">
          <p className="text-lg font-semibold text-gray-600">Loading products...</p>
        </div>
      )}

      {!loading && categoryProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-10">
          <p className="text-lg font-semibold text-gray-600">
            No products available in this collection.
          </p>
        </div>
      )}

      {!loading && categoryProducts.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 mt-6">
          {categoryProducts.map((product) => (
            <ProductCard key={product.productId || product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCategory;



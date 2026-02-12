import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import { motion } from "framer-motion";
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

const BestSeller = () => {
  const [categoryHighlights, setCategoryHighlights] = useState([]);

  useEffect(() => {
    const fetchHighlights = async () => {
      const requests = categories.map(async (category) => {
        const candidates = getCategoryCandidates(category.path);

        for (const candidate of candidates) {
          try {
            const { data } = await axios.get(
              `/products/${encodeURIComponent(candidate)}`,
            );

            const products = extractProducts(data).filter((p) => p?.inStock !== false);
            if (products.length > 0) {
              return products[0];
            }
          } catch {
            // Try next category candidate.
          }
        }

        return null;
      });

      const results = await Promise.all(requests);
      setCategoryHighlights(results.filter(Boolean));
    };

    fetchHighlights();
  }, []);

  return (
    <div id="highlights-section" className="mt-16">
      <p className="text-2xl font-medium md:text-3xl">Category Highlights</p>
      <p className="text-sm text-gray-500 mt-1">
        One available item from each category.
      </p>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.5 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        className="p-6 bg-white rounded-xl"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-5 gap-6 mt-6">
          {categoryHighlights.map((product, index) => (
            <ProductCard
              key={product.productId || product._id || index}
              product={product}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default BestSeller;



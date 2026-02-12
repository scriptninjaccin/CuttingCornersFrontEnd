import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import { getCategoryCandidates } from "../utils/categoryMap";

const extractProduct = (data) => {
  if (!data) return null;
  if (data.product) return data.product;
  if (data.data?.product) return data.data.product;
  if (data.data && !Array.isArray(data.data)) return data.data;
  return data;
};

const ProductPage = () => {
  const { category, price, productId } = useParams();
  const { addToCart, removeFromCart, cartItems, currency } = useAppContext();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId || !category) {
        setProduct(null);
        return;
      }

      setLoading(true);

      try {
        const categoryCandidates = getCategoryCandidates(category);
        let resolvedProduct = null;

        for (const candidate of categoryCandidates) {
          try {
            const { data } = await axios.get(
              `/products/${encodeURIComponent(candidate)}/${encodeURIComponent(price || "0")}/${encodeURIComponent(productId)}`,
            );
            const nextProduct = extractProduct(data);

            if (nextProduct) {
              resolvedProduct = nextProduct;
              break;
            }
          } catch {
            // Try next category candidate.
          }
        }

        setProduct(resolvedProduct);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [category, price, productId]);

  const normalizedProductId = useMemo(
    () => product?.productId || product?._id,
    [product],
  );

  if (loading) return <p className="mt-16">Loading product...</p>;
  if (!product) return <p className="mt-16">Product not found!</p>;

  const quantity = cartItems[normalizedProductId]?.quantity || 0;

  return (
    <div className="mt-16 px-3 md:px-6">
      <h2 className="text-3xl font-semibold">{product.name}</h2>
      <p className="text-gray-600">
        {Array.isArray(product.description)
          ? product.description.join(" ")
          : product.description}
      </p>
      <p className="text-xl mt-2">
        Price: {currency}
        {product.offerPrice || product.price}
      </p>
      <img
        src={product.images?.[0] || product.image?.[0] || "/placeholder.png"}
        alt={product.name}
        className="h-64 w-full object-contain mt-4"
      />

      <div className="mt-4">
        {quantity === 0 ? (
          <button
            onClick={() => addToCart({ ...product, productId: normalizedProductId })}
            className="px-4 py-2 bg-primary text-white rounded"
          >
            Add to Cart
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => removeFromCart(normalizedProductId)}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              -
            </button>
            <span className="px-2">{quantity}</span>
            <button
              onClick={() =>
                addToCart({ ...product, productId: normalizedProductId })
              }
              className="px-3 py-1 bg-gray-200 rounded"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;

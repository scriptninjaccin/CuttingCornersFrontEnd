import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const ProductPage = () => {
  const { category, productId, price } = useParams();
  const { axios, addToCart, removeFromCart, cartItems, currency } = useAppContext();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/products/${category}/${price}/${productId}`);
        setProduct(data.product || data); // adjust based on backend
      } catch (err) {
        console.error("Error fetching product:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [category, price, productId, axios]);

  if (loading) return <p>Loading product...</p>;
  if (!product) return <p>Product not found!</p>;

  const quantity = cartItems[product.productId]?.quantity || 0;

  return (
    <div className="mt-16 px-3 md:px-6">
      <h2 className="text-3xl font-semibold">{product.name}</h2>
      <p className="text-gray-600">{product.description}</p>
      <p className="text-xl mt-2">
        Price: {currency}{product.offerPrice || product.price}
      </p>
      <img
        src={product.images?.[0] || "/placeholder.png"}
        alt={product.name}
        className="h-64 w-full object-contain mt-4"
      />

      <div className="mt-4">
        {quantity === 0 ? (
          <button
            onClick={() => addToCart(product)}
            className="px-4 py-2 bg-primary text-white rounded"
          >
            Add to Cart
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => removeFromCart(product.productId)}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              -
            </button>
            <span className="px-2">{quantity}</span>
            <button
              onClick={() => addToCart(product)}
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

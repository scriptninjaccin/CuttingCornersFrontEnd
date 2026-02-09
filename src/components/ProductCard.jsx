import React, { useState } from "react";
import { assets } from './../assets/assets';
import { useAppContext } from "../context/AppContext";
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const [count, setCount] = useState(0);
  const { currency, addToCart, removeFromCart, navigate, cartItems, updateCartItem } = useAppContext();

   const qty = cartItems[product.productId]?.quantity || 0;

  if (!product) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.5 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
      className="bg-white rounded-xl"
    >
      <div
        onClick={() => { 
          navigate(`/products/${product.category.toLowerCase()}/${product.price}/${product.productId}`); 
          scrollTo(0, 0); 
        }}
        className="border border-gray-200 rounded-md px-3 py-2 bg-white w-full max-w-xs mx-auto sm:mx-0 transition hover:shadow-md cursor-pointer"
      >
        <div className="group flex items-center justify-center px-2">
          <img
            className="object-contain max-h-full group-hover:scale-105 transition-transform duration-200"
            src={product.images?.[0] || assets.placeholder_image}
            alt={product.name}
          />
        </div>

        <div className="text-gray-500/60 text-sm mt-2">
          <p className="capitalize">{product.category}</p>
          <p className="text-gray-700 font-medium text-lg truncate w-full">{product.name}</p>

          <div className="flex items-center gap-0.5 mt-1">
            {Array(5).fill('').map((_, i) => (
              <img
                key={i}
                className="md:w-3.5 w-3"
                src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                alt="star"
              />
            ))}
            <p>(4)</p>
          </div>

          <div className="flex items-end justify-between mt-3">
            <p className="md:text-xl text-base font-medium text-primary">
              {currency}{product.offerPrice || product.price}{" "}
              {product.offerPrice && (
                <span className="text-gray-500/60 md:text-sm text-xs line-through">
                  {currency}{product.price}
                </span>
              )}
            </p>

            <div
              onClick={(e) => e.stopPropagation()}
              className="text-primary"
            >
              {!qty ? (
                <button
                  className="flex items-center justify-center gap-1 bg-primary-100 border border-primary-300 md:w-[80px] w-[64px] h-[34px] rounded text-primary-600"
                  onClick={() => addToCart(product)}
                >
                  <img src={assets.cart_icon} alt="cart-icon" className="w-5 h-5" />
                  Add
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-primary/25 rounded select-none">
                  <button onClick={() => removeFromCart(product.productId)} className="cursor-pointer text-md px-2 h-full">-</button>
                  <span className="w-5 text-center">{qty}</span>
                  <button onClick={() => updateCartItem(product.productId, cartItems[product.productId].quantity + 1)} className="cursor-pointer text-md px-2 h-full">+</button>

                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;

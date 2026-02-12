import React, { useCallback, useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";
import { getCategoryCandidates } from "../utils/categoryMap";

const extractProduct = (data) => {
  if (!data) return null;
  if (data.product) return data.product;
  if (data.data?.product) return data.data.product;
  if (data.data && !Array.isArray(data.data)) return data.data;
  return data;
};

const Cart = () => {
  const [showAddress, setShowAddress] = useState(false);
  const [cartArray, setCartArray] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");

  const {
    cartItems,
    user,
    currency,
    removeFromCart,
    getCartCount,
    getCartAmount,
    navigate,
    updateCartItem,
    setCartItems,
    setShowUserLogin,
  } = useAppContext();

  const getCart = useCallback(async () => {
    const items = Object.entries(cartItems);

    if (items.length === 0) {
      setCartArray([]);
      return;
    }

    const resolvedItems = await Promise.all(
      items.map(async ([productId, item]) => {
        const candidates = getCategoryCandidates(item.category);

        for (const category of candidates) {
          try {
            const { data } = await axios.get(
              `/products/${encodeURIComponent(category)}/${encodeURIComponent(item.price)}/${encodeURIComponent(productId)}`,
            );
            const product = extractProduct(data);

            if (product) {
              return {
                ...product,
                category: product.category || item.category,
                quantity: item.quantity,
                price: item.price,
                productId: product.productId || product._id || productId,
              };
            }
          } catch {
            // Try next category candidate.
          }
        }

        return null;
      }),
    );

    setCartArray(resolvedItems.filter(Boolean));
  }, [cartItems]);

  const getUserAddress = async () => {
    if (!user) {
      setAddresses([]);
      setSelectedAddress(null);
      return;
    }

    try {
      const { data } = await axios.get(`/address/query`);
      if (data?.addresses && data.addresses.length > 0) {
        setAddresses(data.addresses);
        setSelectedAddress(data.addresses[0]);
      } else {
        setAddresses([]);
        setSelectedAddress(null);
      }
    } catch {
      setAddresses([]);
      setSelectedAddress(null);
    }
  };

  const placeOrder = async () => {
    if (!user) {
      toast.error("Please login to place order");
      setShowUserLogin(true);
      return;
    }

    if (!cartArray.length) {
      toast.error("Your cart is empty");
      return;
    }

    if (!selectedAddress) {
      toast.error("Please select an address");
      return;
    }

    const products = cartArray.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      category: item.category,
      price: item.price,
    }));

    try {
      let data;

      if (paymentOption === "COD") {
        ({ data } = await axios.post("/order/cod", {
          products,
          totalPrice: Number((getCartAmount() * 1.02).toFixed(2)),
          addressId: selectedAddress.addressId,
        }));
      } else {
        ({ data } = await axios.post("/order/stripe", {
          items: products,
          addressId: selectedAddress.addressId,
        }));

        if (data?.success) {
          window.location.replace(data.url);
          return;
        }
      }

      if (data) {
        toast.success(data.message || "Order placed successfully");

        await axios.put("/cart", {
          products: [],
          totalPrice: 0,
        });

        setCartItems({});
        navigate("/my-orders");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Network error. Please try again.");
    }
  };

  useEffect(() => {
    getCart();
  }, [getCart]);

  useEffect(() => {
    getUserAddress();
  }, [user]);

  return (
    <div className="flex flex-col md:flex-row mt-16 gap-6">
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart{" "}
          <span className="text-sm text-primary">{getCartCount()} Items</span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
          <p>Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartArray.map((product) => (
          <div
            key={product.productId}
            className="grid grid-cols-[2fr_1fr_1fr] items-center text-sm md:text-base pt-3"
          >
            <div className="flex items-center gap-4">
              <div
                onClick={() =>
                  navigate(
                    `/products/${product.category}/${product.price}/${product.productId}`,
                  )
                }
                className="cursor-pointer w-24 h-24 flex items-center justify-center border rounded"
              >
                <img
                  className="max-w-full h-full object-cover"
                  src={product.images?.[0] || product.image?.[0] || "/placeholder.png"}
                  alt={product.name}
                />
              </div>

              <div>
                <p className="font-semibold">{product.name}</p>

                <div className="text-gray-500 text-sm">
                  <div className="flex items-center gap-2">
                    <p>Qty:</p>
                    <select
                      value={product.quantity}
                      onChange={(e) =>
                        updateCartItem(product.productId, Number(e.target.value))
                      }
                    >
                      {Array(product.quantity > 9 ? product.quantity : 9)
                        .fill("")
                        .map((_, idx) => (
                          <option key={idx} value={idx + 1}>
                            {idx + 1}
                          </option>
                        ))}
                    </select>
                  </div>
                  <p>
                    Price: {currency}
                    {product.price}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-center">
              {currency}
              {(product.price * product.quantity).toFixed(2)}
            </p>

            <button
              className="mx-auto"
              onClick={() => removeFromCart(product.productId)}
            >
              <img src={assets.remove_icon} alt="Remove" className="w-6 h-6" />
            </button>
          </div>
        ))}
      </div>

      <div className="max-w-[360px] w-full">
        {addresses.length === 0 ? (
          <div className="bg-white border border-gray-300 p-6 text-center">
            <h2 className="text-xl font-medium mb-4">
              {user ? "No Address Found" : "Login Required For Checkout"}
            </h2>
            <p className="text-gray-500 mb-6">
              {user
                ? "Please add a delivery address to continue with your order."
                : "You can keep adding items. Login only when you are ready to place the order."}
            </p>

            <button
              onClick={() => {
                if (!user) {
                  setShowUserLogin(true);
                  return;
                }

                navigate("/add-address");
              }}
              className="w-full py-3 bg-primary text-white rounded hover:bg-primary/90 transition"
            >
              {user ? "Add New Address" : "Login To Continue"}
            </button>
          </div>
        ) : (
          <div className="bg-gray-100/40 p-5 border border-gray-300/70">
            <h2 className="text-xl font-medium">Order Summary</h2>
            <hr className="border-gray-300 my-5" />

            <div className="mb-6">
              <p className="text-sm font-medium uppercase">Delivery Address</p>

              <div className="flex justify-between items-start mt-2">
                <p className="text-gray-500">
                  {`${selectedAddress.name}, ${selectedAddress.street}, ${selectedAddress.city}`}
                </p>

                <button
                  onClick={() => setShowAddress(!showAddress)}
                  className="text-primary hover:underline"
                >
                  Change
                </button>
              </div>

              {showAddress && (
                <div className="mt-3 bg-white border text-sm">
                  {addresses.map((address, idx) => (
                    <p
                      key={idx}
                      onClick={() => {
                        setSelectedAddress(address);
                        setShowAddress(false);
                      }}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {`${address.name}, ${address.street}, ${address.city}`}
                    </p>
                  ))}

                  <p
                    onClick={() => navigate("/add-address")}
                    className="text-primary text-center p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Add Address
                  </p>
                </div>
              )}

              <p className="text-sm font-medium uppercase mt-6">Payment Method</p>

              <select
                onChange={(e) => setPaymentOption(e.target.value)}
                className="w-full border bg-white px-3 py-2 mt-2"
              >
                <option value="COD">Cash On Delivery</option>
                <option value="Online">Online Payment</option>
              </select>
            </div>

            <hr />

            <div className="mt-4 space-y-2">
              <p className="flex justify-between">
                <span>Price</span>
                <span>
                  {currency}
                  {getCartAmount().toFixed(2)}
                </span>
              </p>

              <p className="flex justify-between">
                <span>Tax (2%)</span>
                <span>
                  {currency}
                  {(getCartAmount() * 0.02).toFixed(2)}
                </span>
              </p>

              <p className="flex justify-between text-lg font-medium">
                <span>Total</span>
                <span>
                  {currency}
                  {(getCartAmount() * 1.02).toFixed(2)}
                </span>
              </p>
            </div>

            {cartArray.length > 0 && (
              <button
                onClick={placeOrder}
                className="w-full py-3 mt-6 bg-primary text-white rounded hover:bg-primary/90"
              >
                {paymentOption === "COD" ? "Place Order" : "Proceed to Checkout"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";
import Login from "../components/Login";

const Cart = () => {
  const [showAddress, setShowAddress] = useState(false);
  const [cartArray, setCartArray] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");
  const [showLogin, setShowLogin] = useState(false);

  const {
    cartItems,
    user,
    setUser,
    currency,
    removeFromCart,
    getCartCount,
    getCartAmount,
    navigate,
    updateCartItem,
    setCartItems,
    axios: axiosInstance, // optional if using context axios
  } = useAppContext();

  // Fetch product details from backend based on cart items
 const getCart = async () => {
  const tempArray = [];
  for (let productId in cartItems) {
    const item = cartItems[productId];
    try {
      const { data } = await axios.get(`/products/${item.category}/${item.price}/${productId}`);
      tempArray.push({ ...data, quantity: item.quantity });
    } catch (error) {
      console.error("Error fetching product", productId, error);
    }
  }
  setCartArray(tempArray);
};

  // Fetch user addresses
 const getUserAddress = async () => {
  if (!user) return;
  try {
    const { data } = await axios.get(`/address/query`);
    if (data?.addresses && data.addresses.length > 0) {
      setAddresses(data.addresses);
      setSelectedAddress(data.addresses[0]); // pick the first as default
    } else {
      toast.error(data?.message || "No addresses found");
    }
  } catch (error) {
    console.log("Please login first to fetch addresses");
  }
};


  // Place order
  const placeOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select an address");
      return;
    }

    const items = cartArray.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    try {
      if (paymentOption === "COD") {
        const { data } = await axios.post("/order/cod", {
          userId: user._id,
          items,
          addressId: selectedAddress._id,
        });

        if (data?.success) {
          toast.success(data.message);
          setCartItems({});
          navigate("/my-orders");
        } else toast.error(data.message);
      } else {
        const { data } = await axios.post("/order/stripe", {
          userId: user._id,
          items,
          addressId: selectedAddress._id,
        });

        if (data?.success) {
          window.location.replace(data.url);
          setCartItems({});
        } else toast.error(data.message);
      }
    } catch (error) {
      toast.error("Network error. Refreshing page...");
      window.location.reload();
    }
  };
    const tempUser = {
    _id: "testuser123",
    name: "Test User",
    email: "test@example.com"
    };

    // For testing only:
    useEffect(() => {
    if (!user) setUser(tempUser);
    }, []);

  // Update cartArray whenever cartItems change
  useEffect(() => {
    getCart();
  }, [cartItems]);

  // Fetch addresses on mount
  useEffect(() => {
    getUserAddress();
  }, [user]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Login />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row mt-16 gap-6">
      {/* Cart Items */}
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart <span className="text-sm text-primary">{getCartCount()} Items</span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartArray.map((product) => (
          <div
            key={product.productId}
            className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3"
          >
            <div className="flex items-center md:gap-6 gap-3">
              <div
                onClick={() => {
                  navigate(`/products/${product.category.toLowerCase()}/${product.productId}`);
                  scrollTo(0, 0);
                }}
                className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded"
              >
                <img
                  className="max-w-full h-full object-cover"
                  src={product.images?.[0] || "/placeholder.png"}
                  alt={product.name}
                />
              </div>
              <div>
                <p className="hidden md:block font-semibold">{product.name}</p>
                <div className="font-normal text-gray-500/70">
                  <p>
                    Weight: <span>{product.weight || "N/A"}</span>
                  </p>
                  <div className="flex items-center">
                    <p>Qty:</p>                   
                    <select
                      value={product.quantity}
                      onChange={(e) => updateCartItem(product.productId, Number(e.target.value))}
                      className="outline-none"
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
                   <p>Price:{product.price}</p>
                </div>
              </div>
            </div>
            <p className="text-center">{currency}{product.price * product.quantity}</p>
            <button className="cursor-pointer mx-auto" onClick={() => removeFromCart(product.productId)}>
              <img src={assets.remove_icon} alt="Remove" className="inline-block w-6 h-6" />
            </button>
          </div>
        ))}

        <button
          onClick={() => {
            navigate("/products");
            scrollTo(0, 0);
          }}
          className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium"
        >
          <img
            src={assets.arrow_right_icon_colored}
            alt="Arrow"
            className="group-hover:translate-x-1 transition-all"
          />
          Continue Shopping
        </button>
      </div>

      {/* Order Summary */}
      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
        <h2 className="text-xl font-medium">Order Summary</h2>
        <hr className="border-gray-300 my-5" />

        {/* Address */}
        <div className="mb-6">
          <p className="text-sm font-medium uppercase">Delivery Address</p>
          <div className="relative flex justify-between items-start mt-2">
            <div className="relative mt-2">
              {selectedAddress ? (
                <div className="flex justify-between items-start">
                  <p className="text-gray-500">
                    {`${selectedAddress.name} , ${selectedAddress.street}, ${selectedAddress.city}`}
                  </p>
                  <button
                    onClick={() => setShowAddress(!showAddress)}
                    className="text-primary hover:underline cursor-pointer ml-2"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <p className="text-red-300 text-sm">No address found</p>
              )}
            </div>

            {showAddress && (
              <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full">
                {addresses.map((address, idx) => (
                  <p
                    key={idx}
                    onClick={() => {
                      setSelectedAddress(address);
                      setShowAddress(false);
                    }}
                    className="text-gray-500 p-2 hover:bg-gray-100"
                  >
                    {`${address.name}, ${address.street}, ${address.city}`}
                  </p>
                ))}
                <p
                  onClick={() => navigate("/add-address")}
                  className="text-primary text-center cursor-pointer p-2 hover:bg-primary-dull/10"
                >
                  Add address
                </p>
              </div>
            )}
          </div>

          <p className="text-sm font-medium uppercase mt-6">Payment Method</p>
          <select
            onChange={(e) => setPaymentOption(e.target.value)}
            className="cursor-pointer w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none"
          >
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>

        <hr className="border-gray-300" />

        {/* Pricing */}
        <div className="text-gray-500 mt-4 space-y-2">
          <p className="flex justify-between">
            <span>Price</span>
            <span>{currency}{getCartAmount()}</span>
          </p>
          <p className="flex justify-between">
            <span>Shipping Fee</span>
            <span className="text-green-600">Free</span>
          </p>
          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span>{currency}{(getCartAmount() * 0.02).toFixed(2)}</span>
          </p>
          <p className="flex justify-between text-lg font-medium mt-3">
            <span>Total Amount:</span>
            <span>{currency}{getCartAmount() + getCartAmount() * 0.02 }</span>
          </p>
        </div>

        {/* Place Order Button */}
        {cartArray.length > 0 && selectedAddress ? (
          <button
            onClick={placeOrder}
            className="cursor-pointer w-full py-3 mt-6 bg-primary text-white font-medium rounded transition-colors duration-200 hover:bg-primary/90"
          >
            {paymentOption === "COD" ? "Place Order" : "Proceed to Checkout"}
          </button>
        ) : (
          <button
            disabled
            className="w-full py-3 mt-6 bg-gray-300 text-gray-600 font-medium rounded cursor-not-allowed"
          >
            {cartArray.length === 0
              ? "Please add items to proceed"
              : !user
                ? "Please login to proceed"
                : "Please select an address to proceed"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Cart;

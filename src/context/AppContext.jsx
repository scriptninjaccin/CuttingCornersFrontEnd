import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";
import { useAuth } from "./AuthContext";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;

let isAxiosAuthInterceptorAttached = false;

if (!isAxiosAuthInterceptorAttached) {
  axios.interceptors.request.use(async (config) => {
    try {
      const session = await fetchAuthSession();
      const token =
        session.tokens?.idToken?.toString() ||
        session.tokens?.accessToken?.toString();

      if (token) {
        if (!config.headers) {
          config.headers = {};
        }

        if (typeof config.headers.set === "function") {
          config.headers.set("Authorization", `Bearer ${token}`);
        } else {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch {
      // Continue without auth header for public endpoints.
    }

    return config;
  });

  isAxiosAuthInterceptorAttached = true;
}

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const { user: authUser, loading: authLoading } = useAuth();
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const getAuthFallbackUser = () => {
    if (!authUser) return null;

    return {
      id: authUser.userId,
      username: authUser.username,
      email: authUser?.signInDetails?.loginId || authUser.username,
    };
  };

  const fetchSellerStatus = async () => {
    try {
      const { data } = await axios.get("/seller/is-auth");
      setIsSeller(Boolean(data?.success));
    } catch {
      setIsSeller(false);
    }
  };

  const getCartCount = () => {
    let totalCount = 0;

    for (let productId in cartItems) {
      totalCount += cartItems[productId].quantity;
    }

    return totalCount;
  };

  const getCartAmount = () => {
    let totalPrice = 0;

    for (let productId in cartItems) {
      const item = cartItems[productId];
      if (item && item.quantity > 0 && item.price != null) {
        totalPrice += item.price * item.quantity;
      }
    }

    return Math.floor(totalPrice * 100) / 100;
  };

  const prepareCartPayload = (items) => {
    const products = Object.entries(items).map(([productId, item]) => ({
      productId,
      quantity: item.quantity,
      price: item.price,
      category: item.category,
    }));

    const totalPrice = Object.values(items).reduce(
      (sum, item) => sum + item.quantity * item.price,
      0,
    );

    return { products, totalPrice };
  };

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/user/is-auth");
      if (data?.success && data.user) {
        setUser(data.user);
      } else {
        setUser(getAuthFallbackUser());
      }
    } catch {
      setUser(getAuthFallbackUser());
    }
  };

  const fetchCartFromBackend = async () => {
    try {
      const { data } = await axios.get("/cart/");
      const newCartItems = {};

      data.products.forEach((item) => {
        if (item.productId) {
          newCartItems[item.productId] = {
            quantity: item.quantity,
            price: item.price,
            category: item.category,
          };
        }
      });

      setCartItems(newCartItems);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  useEffect(() => {
    if (user) fetchCartFromBackend();
  }, [user]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/product/list");
      if (data?.success) {
        setProducts(data?.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const addToCart = (product) => {
    const newCartItems = structuredClone(cartItems);
    if (newCartItems[product.productId]) {
      newCartItems[product.productId].quantity++;
    } else {
      newCartItems[product.productId] = {
        quantity: 1,
        category: product.category,
        price: product.price,
      };
    }
    setCartItems(newCartItems);
  };

  const updateCartItem = (productId, quantity) => {
    const newCartItems = structuredClone(cartItems);
    if (newCartItems[productId]) {
      newCartItems[productId].quantity = quantity;
      setCartItems(newCartItems);
    }
  };

  const removeFromCart = (productId) => {
    const newCartItems = structuredClone(cartItems);
    if (!newCartItems[productId]) return;

    if (newCartItems[productId].quantity > 1) {
      newCartItems[productId].quantity--;
    } else {
      delete newCartItems[productId];
    }

    setCartItems(newCartItems);
  };

  useEffect(() => {
    fetchProducts();
    fetchSellerStatus();
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!authUser) {
      setUser(null);
      setCartItems({});
      return;
    }

    const fallbackUser = getAuthFallbackUser();
    setUser((prev) => prev || fallbackUser);
    fetchUser();
  }, [authUser, authLoading]);

  useEffect(() => {
    const updateCart = async () => {
      try {
        const payload = prepareCartPayload(cartItems);
        const { data } = await axios.put("/cart/", payload);
        if (!data.success) {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (user) {
      updateCart();
    }
  }, [cartItems]);

  const value = {
    navigate,
    user,
    setUser,
    fetchProducts,
    axios,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartItems,
    setCartItems,
    searchQuery,
    setSearchQuery,
    getCartCount,
    getCartAmount,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};

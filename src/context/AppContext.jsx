import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from 'axios'


axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Authorization'] = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTIzIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNzcwNjg5NDAxLCJleHAiOjE3NzQyODk0MDF9.SaSlSq-xxYwMSf2TQmFtL5963atSlnZcZyqccfiA0Tc';
export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();
    const [user, setUser] = useState({
  email: "test@example.com",
  name: "Test User",
  id: "user123",
});
    const [isSeller, setIsSeller] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [searchQuery, setSearchQuery] = useState({});

    console.log('cartItems', cartItems);

    // fetch seller status

    const fetchSellerStatus = async () => {
        try {
            const { data } = await axios.get("/seller/is-auth");

            if (data?.success) {
                setIsSeller(true);

            }
            else {
                setIsSeller(false);
            }
        } catch (error) {
            setIsSeller(false);
        }
    };

    // get cart item count
    const getCartCount = () => {
        let totalCount = 0;
        for (let productId in cartItems) {
            totalCount += cartItems[productId].quantity;
        }
        return totalCount;
    };
    // get cart item total price
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


    const prepareCartPayload = (cartItems) => {
  const products = Object.entries(cartItems).map(([productId, item]) => ({
    productId,
    quantity: item.quantity,
    price : item.price,
    category: item.category
  }));

  const totalPrice = Object.values(cartItems).reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  return { products, totalPrice };
};


    const fetchUser = async () => {
        try {
            const { data } = await axios.get("/user/is-auth");
            console.log(data);
            if (data?.success) {
                setUser(data.user);
                // setCartItems(data.user.cartItem);
            }
            else {
                setUser(null);
                // setCartItems({});
            }
        } catch (error) {
            console.log("Error fetching user:", error);
        }
    };

    const fetchCartFromBackend = async () => {
//   if (!user) return;
  try {
    const { data } = await axios.get('/cart/', {
    //   headers: { Authorization: `Bearer ${user.token}` } // or fake token in dev
    });

    // Convert backend response to frontend cartItems shape
    const newCartItems = {};
    console.log('backend cart data', data)
    data.products.forEach(item => {
      if (item.productId) {
        newCartItems[item.productId] = {
          quantity: item.quantity,
          price: item.price,
          category: item.category
        };
      }
    });

    setCartItems(newCartItems);
  } catch (err) {
    console.error('Error fetching cart:', err);
  }
};

useEffect(() => {
   if (user) fetchCartFromBackend();
}, [user]);


    const fetchProducts = async () => {
        // setProducts(dummyProducts);
        try {
            const { data } = await axios.get("/product/list");
            console.log(data);
            if (data?.success) {
                setProducts(data?.products);
                // toast.success(data.message);
            }
            else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

   // Add to cart
const addToCart = (product) => {
  // product = { productId, category, price }
  const newCartItems = structuredClone(cartItems);
  if (newCartItems[product.productId]) {
    newCartItems[product.productId].quantity++;
  } else {
    newCartItems[product.productId] = {
      quantity: 1,
      category: product.category,
      price: product.price
    };
  }
  setCartItems(newCartItems);
};

    // update cart item 

    // Update quantity
const updateCartItem = (productId, quantity) => {
  const newCartItems = structuredClone(cartItems);
  if (newCartItems[productId]) {
    newCartItems[productId].quantity = quantity;
    setCartItems(newCartItems);
  }
};


   // Remove item
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
        fetchUser();
        fetchProducts();
        fetchSellerStatus();
    }, [])

    useEffect(() => {

        const updateCart = async () => {

            try {
                 const payload = prepareCartPayload(cartItems);
                 console.log('prepared cart payload', payload)                    
                const { data } = await axios.put("/cart/", payload);
                console.log("updated data", data);
                if (!data.success) {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.message);
            }
        }
        if (user) {
            updateCart();
        }
    }, [cartItems])

    const value = { navigate, user, setUser, fetchProducts , axios, isSeller, setIsSeller, showUserLogin, setShowUserLogin, products, currency, addToCart, updateCartItem, removeFromCart, cartItems, setCartItems, searchQuery, setSearchQuery, getCartCount, getCartAmount };
    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>;
};

export const useAppContext = () => {
    return useContext(AppContext);
};


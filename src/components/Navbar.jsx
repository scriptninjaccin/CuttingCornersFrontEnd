import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, setUser, setShowUserLogin, getCartCount, searchQuery, setSearchQuery } = useAppContext();
  const navigate = useNavigate();

  // Logout function
  const handleLogout = async () => {
    try {
      const { data } = await axios.get('/user/logout');
      if (data.success) {
        toast.success(data.message);
        setUser(null);
        navigate('/');
        setOpen(false);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error('Error in logout:', err);
      window.location.reload();
    }
  };

  // Handle search submission
  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;
    navigate(`/products?search=${encodeURIComponent(trimmedQuery)}`);
    scrollTo(0, 0);
  };

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white sticky top-0 z-50 shadow transition-all">

      {/* Logo */}
      <Link to="/" onClick={() => setOpen(false)}>
        <img src={assets.logo} alt="Logo" className="h-10" />
      </Link>

      {/* Desktop menu */}
      <div className="hidden md:flex items-center gap-8">
        {!user && <Link to="/seller" onClick={() => setOpen(false)}>Seller Login</Link>}
        <Link to="/" onClick={() => setOpen(false)}>Home</Link>
        <Link to="/products" onClick={() => setOpen(false)}>All Products</Link>
        {user && <Link to="/my-orders" onClick={() => setOpen(false)}>My Orders</Link>}
        <Link to="/contact" onClick={() => { setOpen(false); scrollTo(0, 0); }}>Contact</Link>

        {/* Search */}
        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
          <input
            type="text"
            placeholder="Search products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
          />
          <img
            src={assets.search_icon}
            alt="Search"
            className="w-4 h-4 cursor-pointer"
            onClick={handleSearch}
          />
        </div>

        {/* Cart */}
        <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
          <img src={assets.cart_icon} alt="Cart" className="w-6 opacity-80" />
          <span className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full flex items-center justify-center">
            {getCartCount()}
          </span>
        </div>

        {/* User profile */}
        {!user ? (
          <button
            onClick={() => setShowUserLogin(true)}
            className="px-8 py-2 bg-primary hover:bg-primary-dull text-white rounded-full"
          >
            Login
          </button>
        ) : (
          <div className="relative group cursor-pointer">
            <img
              src={assets.profile_icon}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <ul className="absolute right-0 mt-0 w-40 bg-white border rounded-md shadow-md opacity-0 translate-y-[-10px] group-hover:opacity-100 group-hover:translate-y-0 invisible group-hover:visible transition-all duration-300 origin-top-right z-10 pointer-events-none group-hover:pointer-events-auto">
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => { navigate('/my-orders'); setOpen(false); }}
              >
                My Orders
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Mobile menu button */}
      <div className="flex items-center gap-6 md:hidden">
        <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
          <img src={assets.cart_icon} alt="Cart" className="w-6 opacity-80" />
          <span className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full flex items-center justify-center">
            {getCartCount()}
          </span>
        </div>

        <button onClick={() => setOpen(!open)}>
          <img src={assets.menu_icon} alt="Menu" className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile menu dropdown */}
      <div className={`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full bg-white shadow-md flex-col items-start gap-4 px-5 py-6 text-base md:hidden transition-all duration-300 z-20`}>
        {!user && <Link to="/seller" onClick={() => setOpen(false)}>Seller Login</Link>}
        <Link to="/" onClick={() => setOpen(false)}>Home</Link>
        <Link to="/products" onClick={() => setOpen(false)}>All Products</Link>
        {user && <Link to="/my-orders" onClick={() => setOpen(false)}>My Orders</Link>}
        <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>
        {!user ? (
          <button
            onClick={() => { setShowUserLogin(true); setOpen(false); }}
            className="w-full px-6 py-2 bg-primary hover:bg-primary-dull text-white rounded-full text-center"
          >
            Login
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full px-6 py-2 bg-primary hover:bg-primary-dull text-white rounded-full text-center"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

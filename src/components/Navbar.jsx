import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaPaw, FaUser, FaSun, FaMoon, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const navLinks = user
    ? [
        { name: "Home", path: "/" },
        { name: "Pets & Supplies", path: "/pets-supplies" },
        { name: "Add Listing", path: "/add-listing" },
        { name: "My Listings", path: "/my-listings" },
        { name: "My Orders", path: "/my-orders" },
      ]
    : [
        { name: "Home", path: "/" },
        { name: "Pets & Supplies", path: "/pets-supplies" },
      ];

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-pink-500 dark:from-gray-800 dark:to-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-2xl font-bold"
          >
            {/* <FaPaw className="text-3xl" /> */}
            <FaPaw className="text-3xl" />
            <span>PawMart</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="hover:text-yellow-300 transition-colors duration-300"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>

            {/* User Menu */}
            {user ? (
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <img
                    src={user.photoURL || "https://via.placeholder.com/150"}
                    alt={user.displayName}
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                  <span className="font-medium">
                    {user.displayName?.split(" ")[0]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex space-x-4">
                <Link
                  to="/login"
                  className="bg-white text-purple-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-yellow-400 text-gray-800 hover:bg-yellow-500 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/20"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-yellow-300 py-2 border-b border-white/20"
                >
                  {link.name}
                </Link>
              ))}
              {user ? (
                <>
                  <div className="flex items-center space-x-2 py-2 border-b border-white/20">
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{user.displayName}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-center"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="bg-white text-purple-600 hover:bg-gray-100 px-4 py-2 rounded-lg text-center"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="bg-yellow-400 text-gray-800 hover:bg-yellow-500 px-4 py-2 rounded-lg text-center"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

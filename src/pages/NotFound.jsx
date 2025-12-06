
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPaw, FaHome, FaSearch, FaArrowLeft } from 'react-icons/fa';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6">
            <FaPaw className="text-6xl text-white" />
          </div>
          <h1 className="text-9xl font-bold text-gray-900 dark:text-white mb-4">
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            The page you're looking for seems to have wandered off.
            <br />
            Don't worry, we'll help you find your way back!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <FaArrowLeft />
              Go Back
            </button>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <FaHome />
              Go Home
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Here are some helpful links instead:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/pets-supplies"
                className="bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 p-4 rounded-xl transition-colors"
              >
                <div className="text-3xl mb-2">🐶</div>
                <h4 className="font-semibold mb-1">Browse Pets</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Find pets for adoption
                </p>
              </Link>
              <Link
                to="/add-listing"
                className="bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 p-4 rounded-xl transition-colors"
              >
                <div className="text-3xl mb-2">📝</div>
                <h4 className="font-semibold mb-1">Add Listing</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  List a pet or product
                </p>
              </Link>
              <Link
                to="/"
                className="bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 p-4 rounded-xl transition-colors"
              >
                <div className="text-3xl mb-2">🏠</div>
                <h4 className="font-semibold mb-1">Home Page</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Return to homepage
                </p>
              </Link>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-gray-500 dark:text-gray-400">
              Still lost? Try searching:
            </p>
            <div className="max-w-md mx-auto mt-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search PawMart..."
                  className="w-full px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                <button className="absolute right-3 top-3 text-gray-500">
                  <FaSearch />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
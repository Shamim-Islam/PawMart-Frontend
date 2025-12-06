import React from "react";
import { motion } from "framer-motion";
import { FaPaw } from "react-icons/fa";

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="relative"
      >
        <div className="w-16 h-16 border-4 border-purple-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"></div>
        <FaPaw className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-500" />
      </motion.div>
      <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;

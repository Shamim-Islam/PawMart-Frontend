
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CategoryCard = ({ category }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative overflow-hidden rounded-2xl shadow-lg group"
    >
      <Link to={`/category/${category.name.toLowerCase().split(' ')[0]}`}>
        <div className={`bg-gradient-to-br ${category.color} p-6 h-64 flex flex-col justify-center items-center text-white relative`}>
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          <span className="text-5xl mb-4">{category.icon}</span>
          <h3 className="text-2xl font-bold text-center mb-2">{category.name}</h3>
          <p className="text-lg opacity-90">{category.count} listings</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
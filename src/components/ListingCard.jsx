import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaTag } from "react-icons/fa";

const ListingCard = ({ listing }) => {
  const isFree = listing.price === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={listing.image}
          alt={listing.name}
          className="w-full  object-cover hover:scale-110 transition-transform duration-500"
        />
        {isFree && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full font-bold">
            FREE
          </div>
        )}
        <div className="absolute top-4 left-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {listing.category?.name}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 truncate">{listing.name}</h3>

        <div className="flex items-center text-gray-600 dark:text-gray-300 mb-3">
          <FaMapMarkerAlt className="mr-2" />
          <span>{listing.location}</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold">
            {isFree ? (
              <span className="text-green-500">Free Adoption</span>
            ) : (
              <span className="text-purple-600">৳{listing.price}</span>
            )}
          </div>

          <Link
            to={`/listing/${listing?._id}`}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300"
          >
            See Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ListingCard;

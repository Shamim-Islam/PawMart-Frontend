import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaFilter,
  FaTimes,
  FaMapMarkerAlt,
  FaTag,
} from "react-icons/fa";
import ListingCard from "../components/ListingCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { listingsAPI } from "../api/apiService";

const PetsSupplies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const categoryFromURL = searchParams.get("category");
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  const [selectedCategory, setSelectedCategory] = useState(
    categoryFromURL || "all"
  );

  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
  });

  const categories = [
    { value: "all", label: "All Categories", icon: "📦" },
    { value: "pets", label: "Pets (Adoption)", icon: "🐶" },
    { value: "pet-food", label: "Pet Food", icon: "🍖" },
    { value: "accessories", label: "Accessories", icon: "🧸" },
    { value: "pet-care-products", label: "Pet Care Products", icon: "💊" },
  ];

  useEffect(() => {
    if (categoryFromURL) {
      setSelectedCategory(categoryFromURL);
    }
  }, [categoryFromURL]);

  useEffect(() => {
    fetchListings();
  }, [selectedCategory, searchTerm, priceRange, pagination.currentPage]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        status: "available",
      };

      if (selectedCategory !== "all") {
        params.category = selectedCategory;
      }

      if (searchTerm) {
        params.search = searchTerm;
      }

      if (priceRange[0] > 0 || priceRange[1] < 10000) {
        params.minPrice = priceRange[0];
        params.maxPrice = priceRange[1];
      }

      const response = await listingsAPI.getAll(params);
      setListings(response.data.listings);
      setFilteredListings(response.data.listings);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ search: searchTerm });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchListings();
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePriceRangeChange = (min, max) => {
    setPriceRange([min, max]);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setPriceRange([0, 10000]);
    setSearchParams({});
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Pet & Supplies
            </h1>
            <p className="text-xl opacity-90">
              Browse through our collection of pets for adoption and pet care
              products
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-grow">
              <div className="relative">
                <div className="absolute left-4 top-3.5 text-gray-400">
                  <FaSearch />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search pets, food, accessories..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-3 rounded-lg transition-colors"
            >
              <FaFilter />
              Filters
              {showFilters && <FaTimes className="ml-2" />}
            </button>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat.value}
                          onClick={() => handleCategoryChange(cat.value)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                            selectedCategory === cat.value
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                          }`}
                        >
                          <span>{cat.icon}</span>
                          <span>{cat.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Price Range: ৳{priceRange[0]} - ৳{priceRange[1]}
                    </label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        step="100"
                        value={priceRange[0]}
                        onChange={(e) =>
                          handlePriceRangeChange(
                            parseInt(e.target.value),
                            priceRange[1]
                          )
                        }
                        className="w-full"
                      />
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        step="100"
                        value={priceRange[1]}
                        onChange={(e) =>
                          handlePriceRangeChange(
                            priceRange[0],
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-end">
                    <div className="flex gap-3">
                      <button
                        onClick={clearFilters}
                        className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-3 rounded-lg transition-colors"
                      >
                        Clear Filters
                      </button>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition-colors"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">
              {selectedCategory !== "all"
                ? `${
                    categories.find((c) => c.value === selectedCategory)?.label
                  }`
                : "All Listings"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {pagination.totalItems} listings found
            </p>
          </div>
          <div className="text-sm text-gray-500">
            {selectedCategory !== "all" && (
              <button
                onClick={() => handleCategoryChange("all")}
                className="text-blue-500 hover:text-blue-600"
              >
                View all categories →
              </button>
            )}
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : filteredListings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
          >
            <div className="text-6xl mb-4">🐾</div>
            <h3 className="text-2xl font-bold mb-2">No listings found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={clearFilters}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Clear All Filters
            </button>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredListings.map((listing, index) => (
                  <motion.div
                    key={listing._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ListingCard listing={listing} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Previous
                  </button>

                  {[...Array(pagination.totalPages)].map((_, index) => {
                    const page = index + 1;
                    const isCurrent = page === pagination.currentPage;
                    const showPage =
                      page === 1 ||
                      page === pagination.totalPages ||
                      (page >= pagination.currentPage - 1 &&
                        page <= pagination.currentPage + 1);

                    if (!showPage) {
                      if (
                        page === pagination.currentPage - 2 ||
                        page === pagination.currentPage + 2
                      ) {
                        return (
                          <span key={page} className="px-2">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg ${
                          isCurrent
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PetsSupplies;

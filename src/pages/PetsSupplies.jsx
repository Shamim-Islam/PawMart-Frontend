
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaFilter, FaTimes, FaMapMarkerAlt, FaTag } from 'react-icons/fa';
import ListingCard from '../components/ListingCard';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const PetsSupplies = () => {
  const { categoryName } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { value: 'all', label: 'All Categories', icon: '📦' },
    { value: 'pets', label: 'Pets (Adoption)', icon: '🐶' },
    { value: 'food', label: 'Pet Food', icon: '🍖' },
    { value: 'accessories', label: 'Accessories', icon: '🧸' },
    { value: 'care', label: 'Care Products', icon: '💊' }
  ];

  useEffect(() => {
    // Set initial category from URL
    if (categoryName) {
      setSelectedCategory(categoryName);
    }
  }, [categoryName]);

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    filterListings();
  }, [listings, searchTerm, selectedCategory, priceRange]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        const mockListings = [
          { id: 1, name: "Golden Retriever Puppy", category: "Pets", price: 0, location: "Dhaka", image: "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80", description: "Friendly 2-month-old puppy looking for a loving home." },
          { id: 2, name: "Premium Dog Food", category: "Food", price: 1200, location: "Chattogram", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80", description: "High-quality dog food for all breeds." },
          { id: 3, name: "Pet Carrier Bag", category: "Accessories", price: 2500, location: "Sylhet", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80", description: "Comfortable pet carrier for travel." },
          { id: 4, name: "Cat Litter Box", category: "Care", price: 1800, location: "Dhaka", image: "https://images.unsplash.com/photo-1573866926487-a1865558a9cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80", description: "Modern cat litter box with odor control." },
          { id: 5, name: "Siamese Kitten", category: "Pets", price: 0, location: "Khulna", image: "https://images.unsplash.com/photo-1514888286974-6d03bde4ba0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80", description: "Beautiful Siamese kitten ready for adoption." },
          { id: 6, name: "Dog Toys Set", category: "Accessories", price: 850, location: "Rajshahi", image: "https://images.unsplash.com/photo-1554456854-55a089fd4cb2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80", description: "Set of 5 durable dog toys." },
          { id: 7, name: "Fish Tank", category: "Care", price: 3500, location: "Dhaka", image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80", description: "20-gallon fish tank with filter." },
          { id: 8, name: "Bird Cage", category: "Accessories", price: 2200, location: "Chattogram", image: "https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80", description: "Spacious bird cage with accessories." },
          { id: 9, name: "Rabbit Hutch", category: "Accessories", price: 4200, location: "Sylhet", image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80", description: "Outdoor rabbit hutch with weather protection." }
        ];
        setListings(mockListings);
        setFilteredListings(mockListings);
        setLoading(false);
      }, 1500);
    } catch (error) {
      toast.error('Failed to load listings');
      setLoading(false);
    }
  };

  const filterListings = () => {
    let filtered = [...listings];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(listing =>
        listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      const categoryMap = {
        'pets': 'Pets',
        'food': 'Food',
        'accessories': 'Accessories',
        'care': 'Care'
      };
      filtered = filtered.filter(listing => 
        listing.category === categoryMap[selectedCategory]
      );
    }

    // Filter by price range
    filtered = filtered.filter(listing =>
      listing.price >= priceRange[0] && listing.price <= priceRange[1]
    );

    setFilteredListings(filtered);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    filterListings();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPriceRange([0, 10000]);
    setSearchParams({});
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
              Browse through our collection of pets for adoption and pet care products
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
                animate={{ opacity: 1, height: 'auto' }}
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
                          onClick={() => setSelectedCategory(cat.value)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${selectedCategory === cat.value
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
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
                        onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                        className="w-full"
                      />
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        step="100"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
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
              {selectedCategory !== 'all' 
                ? `${categories.find(c => c.value === selectedCategory)?.label}`
                : 'All Listings'
              }
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {filteredListings.length} listings found
            </p>
          </div>
          <div className="text-sm text-gray-500">
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredListings.map((listing, index) => (
                <motion.div
                  key={listing.id}
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
        )}
      </div>
    </div>
  );
};

export default PetsSupplies;
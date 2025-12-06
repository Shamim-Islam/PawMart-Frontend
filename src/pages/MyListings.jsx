
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaTrash, FaEye, FaPlus, FaChartLine, FaDollarSign, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';

const MyListings = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingListing, setEditingListing] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        const mockListings = [
          { 
            _id: '1', 
            name: "Golden Retriever Puppy", 
            category: "Pets", 
            price: 0, 
            location: "Dhaka", 
            description: "Friendly 2-month-old puppy looking for a loving home.",
            image: "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            date: "2024-01-15",
            email: user?.email,
            status: "active"
          },
          { 
            _id: '2', 
            name: "Premium Dog Food", 
            category: "Food", 
            price: 1200, 
            location: "Chattogram", 
            description: "High-quality dog food for all breeds.",
            image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            date: "2024-01-10",
            email: user?.email,
            status: "active"
          }
        ];
        setListings(mockListings);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast.error('Failed to load your listings');
      setLoading(false);
    }
  };

  const handleEdit = (listing) => {
    setEditingListing({ ...listing });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingListing) return;

    try {
      // Simulate API call
      setTimeout(() => {
        setListings(prev => prev.map(listing => 
          listing._id === editingListing._id ? editingListing : listing
        ));
        toast.success('Listing updated successfully!');
        setShowEditModal(false);
        setEditingListing(null);
      }, 1000);
    } catch (error) {
      toast.error('Failed to update listing');
    }
  };

  const handleDelete = (listing) => {
    setListingToDelete(listing);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!listingToDelete) return;

    try {
      // Simulate API call
      setTimeout(() => {
        setListings(prev => prev.filter(listing => listing._id !== listingToDelete._id));
        toast.success('Listing deleted successfully!');
        setShowDeleteModal(false);
        setListingToDelete(null);
      }, 1000);
    } catch (error) {
      toast.error('Failed to delete listing');
    }
  };

  const formatPrice = (price) => {
    return price === 0 ? 'Free' : `৳${price}`;
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      sold: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    };
    return colors[status] || colors.active;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                My Listings
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage your pets and products listed on PawMart
              </p>
            </div>
            <Link
              to="/add-listing"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              <FaPlus />
              Add New Listing
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Listings</p>
                  <p className="text-2xl font-bold mt-1">{listings.length}</p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <FaChartLine className="text-purple-600 dark:text-purple-300 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
                  <p className="text-2xl font-bold mt-1">
                    {listings.filter(l => l.status === 'active').length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <FaEye className="text-green-600 dark:text-green-300 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Value</p>
                  <p className="text-2xl font-bold mt-1">
                    ৳{listings.reduce((sum, listing) => sum + listing.price, 0)}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <FaDollarSign className="text-blue-600 dark:text-blue-300 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Free Adoptions</p>
                  <p className="text-2xl font-bold mt-1">
                    {listings.filter(l => l.price === 0).length}
                  </p>
                </div>
                <div className="p-3 bg-pink-100 dark:bg-pink-900 rounded-lg">
                  <FaPlus className="text-pink-600 dark:text-pink-300 text-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Listings Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : listings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
          >
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold mb-2">No listings yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start by adding your first listing
            </p>
            <Link
              to="/add-listing"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              <FaPlus />
              Add Your First Listing
            </Link>
          </motion.div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Item
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Category
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Price
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Location
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Date
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Status
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <AnimatePresence>
                    {listings.map((listing, index) => (
                      <motion.tr
                        key={listing._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <img
                              src={listing.image}
                              alt={listing.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {listing.name}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                {listing.description.substring(0, 50)}...
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            {listing.category === 'Pets' ? '🐶' : 
                             listing.category === 'Food' ? '🍖' :
                             listing.category === 'Accessories' ? '🧸' : '💊'}
                            {listing.category}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`font-bold ${listing.price === 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                            {formatPrice(listing.price)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <FaMapMarkerAlt />
                            {listing.location}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt />
                            {new Date(listing.date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(listing.status)}`}>
                            {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/listing/${listing._id}`}
                              className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                              title="View Details"
                            >
                              <FaEye />
                            </Link>
                            <button
                              onClick={() => handleEdit(listing)}
                              className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(listing)}
                              className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && editingListing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-4">Edit Listing</h3>
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      value={editingListing.name}
                      onChange={(e) => setEditingListing({...editingListing, name: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Price</label>
                    <input
                      type="number"
                      value={editingListing.price}
                      onChange={(e) => setEditingListing({...editingListing, price: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="flex-1 bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && listingToDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 mb-4">
                  <FaTrash className="h-6 w-6 text-red-600 dark:text-red-300" />
                </div>
                <h3 className="text-lg font-bold mb-2">Delete Listing</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Are you sure you want to delete "{listingToDelete.name}"? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyListings;
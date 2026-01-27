import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaPlus,
  FaChartLine,
  FaDollarSign,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaHeart,
} from "react-icons/fa";
import { listingsAPI } from "../api/apiService";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const MyListings = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingListing, setEditingListing] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    totalValue: 0,
    freeAdoptions: 0,
  });

  const fetchMyListings = async () => {
    try {
      if (!user?.email) return;
      setLoading(true);
      const response = await listingsAPI.getMyListings(user.email);

      setListings(response || []);

      //state counting calculation
      const total = response?.length || 0;
      const active =
        response?.filter((l) => l.status === "Available").length || 0;
      const totalValue =
        response?.reduce((sum, listing) => sum + (listing.price || 0), 0) || 0;
      const freeAdoptions =
        response?.filter(
          (l) =>
            (l.price === 0 || l.price === "0") &&
            (l.category?.name === "Pets" || l.category?.slug === "pets")
        ).length || 0;

      setStats({ total, active, totalValue, freeAdoptions });
    } catch (error) {
      toast.error("Failed to load your listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchMyListings();
    }
  }, [user?.email]);

  const handleEdit = (listing) => {
    setEditingListing({ ...listing });
    setShowEditModal(true);
  };

  // const handleUpdate = async (e) => {
  //   e.preventDefault();
  //   if (!editingListing) return;
  //   console.log(editingListing);
  //   try {
  //     // 1. API call
  //     await listingsAPI.update(editingListing._id, {
  //       name: editingListing.name,
  //       price: Number(editingListing.price),
  //       location: editingListing.location,
  //       image: editingListing.image,
  //       description: editingListing.description,
  //     });

  //     // 2. Modal close
  //     setShowEditModal(false);
  //     setEditingListing(null);

  //     // 3. Refresh the listings (simple solution)
  //     setTimeout(() => {
  //       fetchMyListings();
  //     }, 500);

  //     toast.success("Updated successfully!");
  //   } catch (error) {
  //     console.error("Error:", error);
  //     toast.error("Update failed!");
  //   }
  // };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingListing) return;
    console.log(editingListing);
    try {
      const updatedListing = {
        name: editingListing.name,
        price: Number(editingListing.price),
        location: editingListing.location,
        image: editingListing.image,
        description: editingListing.description,
      };

      axios.put(
        `http://localhost:5000/update/${editingListing._id}`,
        updatedListing
      );
      // .then((res) => {
      //   console.log(res.data);
      // })
      // .catch((err) => {
      //   console.log(err);
      // });

      // 2. Modal close
      setShowEditModal(false);
      setEditingListing(null);

      // 3. Refresh the listings (simple solution)
      setTimeout(() => {
        fetchMyListings();
      }, 500);

      toast.success("Updated successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Update failed!");
    }
  };

  const handleDelete = (listing) => {
    setListingToDelete(listing);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!listingToDelete) return;

    try {
      await listingsAPI.delete(listingToDelete._id);
      setListings((prev) =>
        prev.filter((listing) => listing._id !== listingToDelete._id)
      );
      toast.success("Listing deleted successfully!");
      setShowDeleteModal(false);
      setListingToDelete(null);

      // Update stats
      setStats((prev) => ({
        ...prev,
        total: prev.total - 1,
        active:
          listingToDelete.status === "Available"
            ? prev.active - 1
            : prev.active,
        totalValue: prev.totalValue - listingToDelete.price,
        freeAdoptions:
          listingToDelete.price === 0 && listingToDelete.category === "Pets"
            ? prev.freeAdoptions - 1
            : prev.freeAdoptions,
      }));
    } catch (error) {
      toast.error("Failed to delete listing");
    }
  };

  const handleStatusChange = async (listingId, newStatus) => {
    try {
      const updatedListing = { status: newStatus };
      const response = await listingsAPI.update(listingId, updatedListing);

      setListings((prev) => {
        const newListings = prev.map((listing) =>
          listing._id === listingId ? response.data.listing : listing
        );

        // Recalculate stats
        const total = newListings.length;
        const active = newListings.filter(
          (l) => l.status === "Available"
        ).length;
        const totalValue = newListings.reduce(
          (sum, listing) => sum + (listing.price || 0),
          0
        );
        const freeAdoptions = newListings.filter(
          (l) =>
            (l.price === 0 || l.price === "0") &&
            (l.category?.name === "Pets" || l.category?.slug === "pets")
        ).length;

        setStats({ total, active, totalValue, freeAdoptions });

        return newListings;
      });

      toast.success(`Listing marked as ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update listing status");
    }
  };
  const formatPrice = (price) => {
    if (price === null || price === undefined) return "N/A";
    return Number(price).toLocaleString();
  };

  const getStatusColor = (status) => {
    const colors = {
      available:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      sold: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      adopted:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    };
    return colors[status] || colors.available;
  };

  const getStatusOptions = (currentStatus) => {
    const allOptions = ["available", "pending", "sold", "adopted"];
    return allOptions.filter((option) => option !== currentStatus);
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
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total Listings
                  </p>
                  <p className="text-2xl font-bold mt-1">{stats.total}</p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <FaChartLine className="text-purple-600 dark:text-purple-300 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Active
                  </p>
                  <p className="text-2xl font-bold mt-1">{stats.active}</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <FaEye className="text-green-600 dark:text-green-300 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total Value
                  </p>
                  <p className="text-2xl font-bold mt-1">
                    ৳{stats.totalValue.toLocaleString()}
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
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Free Adoptions
                  </p>
                  <p className="text-2xl font-bold mt-1">
                    {stats.freeAdoptions}
                  </p>
                </div>
                <div className="p-3 bg-pink-100 dark:bg-pink-900 rounded-lg">
                  <FaHeart className="text-pink-600 dark:text-pink-300 text-xl" />
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
                              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <FaMapMarkerAlt />
                                {listing.location}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            {listing.category?.slug === "pets"
                              ? "🐶 "
                              : listing.category?.slug === "pet-food"
                              ? " 🍖 "
                              : listing.category?.slug === "accessories"
                              ? "🧸 "
                              : "💊 "}
                            {listing.category?.slug}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`font-bold ${
                              listing.price === 0
                                ? "text-green-600 dark:text-green-400"
                                : "text-gray-900 dark:text-white"
                            }`}
                          >
                            {formatPrice(listing.price)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                listing.status
                              )}`}
                            >
                              {(listing.status || "Available")
                                .charAt(0)
                                .toUpperCase() +
                                (listing.status || "Available").slice(1)}
                            </span>
                            <select
                              value={listing.status}
                              onChange={(e) =>
                                handleStatusChange(listing._id, e.target.value)
                              }
                              className="text-sm border rounded px-2 py-1 bg-transparent"
                            >
                              {getStatusOptions(listing.status).map(
                                (option) => (
                                  <option key={option} value={option}>
                                    Mark as {option}
                                  </option>
                                )
                              )}
                            </select>
                          </div>
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
                    <label className="block text-sm font-medium mb-2">
                      Product / Pet Name
                    </label>
                    <input
                      type="text"
                      value={editingListing.name}
                      onChange={(e) =>
                        setEditingListing({
                          ...editingListing,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Price
                    </label>
                    <input
                      type="number"
                      value={editingListing.price}
                      onChange={(e) =>
                        setEditingListing({
                          ...editingListing,
                          price: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={editingListing.location}
                      onChange={(e) =>
                        setEditingListing({
                          ...editingListing,
                          location: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Image URL
                    </label>
                    <input
                      type="text"
                      value={editingListing.image}
                      onChange={(e) =>
                        setEditingListing({
                          ...editingListing,
                          image: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Description
                    </label>
                    <textarea
                      value={editingListing.description}
                      onChange={(e) =>
                        setEditingListing({
                          ...editingListing,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                      rows="3"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user?.email}</p>
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
                  Are you sure you want to delete "{listingToDelete.name}"? This
                  action cannot be undone.
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

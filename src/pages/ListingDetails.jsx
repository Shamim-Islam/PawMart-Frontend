import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTag,
  FaEnvelope,
  FaPhone,
  FaHome,
  FaPaw,
  FaHeart,
} from "react-icons/fa";
import { listingsAPI, ordersAPI } from "../api/apiService";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";

const categoryIconMap = {
  pets: "🐶",
  food: "🍖",
  accessories: "🧸",
  "pet-care-product": "💊",
};

const ListingDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [orderForm, setOrderForm] = useState({
    productId: "",
    quantity: 1,
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Bangladesh",
    },
    phone: "",
    pickupDate: new Date().toISOString().split("T")[0],
    additionalNotes: "",
  });

  useEffect(() => {
    fetchListing();
  }, [id]);

  useEffect(() => {
    if (listing) {
      checkIfLiked();
    }
  }, [listing]);

  useEffect(() => {
    if (user && listing) {
      setOrderForm((prev) => ({
        ...prev,
        productId: listing._id,
        quantity: listing.category.slug === "pets" ? 1 : prev.quantity,
        pickupDate: listing.pickupDate
          ? new Date(listing.pickupDate).toISOString().split("T")[0]
          : prev.pickupDate,
      }));
    }
  }, [user, listing]);

  const fetchListing = async () => {
    setLoading(true);
    try {
      const response = await listingsAPI.getById(id);
      setListing(response);
    } catch (error) {
      console.error("Error fetching listing:", error);
      toast.error("Failed to load listing details");
    } finally {
      setLoading(false);
    }
  };

  const checkIfLiked = async () => {
    if (!user || !listing) return;

    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const favorites = userData.favorites || [];
      setIsLiked(favorites.includes(id));
    } catch (error) {
      console.error("Error checking like status:", error);
    }
  };

  const handleToggleLike = async () => {
    if (!user) {
      toast.error("Please login to like listings");
      navigate("/login");
      return;
    }

    try {
      await listingsAPI.toggleLike(id);
      setIsLiked(!isLiked);
      toast.success(isLiked ? "Removed from favorites" : "Added to favorites");
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }

    // Validate form
    if (!orderForm.address.street.trim()) {
      toast.error("Please enter street address");
      return;
    }

    if (!orderForm.address.city.trim()) {
      toast.error("Please enter city");
      return;
    }

    if (!orderForm.address.state.trim()) {
      toast.error("Please enter state");
      return;
    }

    if (!orderForm.address.zipCode.trim()) {
      toast.error("Please enter zip code");
      return;
    }

    if (!orderForm.phone.trim()) {
      toast.error("Please enter phone number");
      return;
    }

    setLoading(true);
    try {
      await ordersAPI.create(orderForm);

      toast.success("Order placed successfully!");
      setShowOrderModal(false);
      navigate("/my-orders");
    } catch (error) {
      console.error("Error placing order:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setOrderForm((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setOrderForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Listing not found</h2>
          <button
            onClick={() => navigate("/pets-supplies")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Browse Listings
          </button>
        </div>
      </div>
    );
  }

  const isFree = listing.price === 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="relative h-[450px] overflow-hidden">
            <img
              src={listing.image}
              alt={listing.name}
              className="w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                    <span className="text-xl">
                      {categoryIconMap[listing.category.slug] || "📦"}
                    </span>
                    <span className="font-medium">{listing.category.slug}</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">
                    {listing.name}
                  </h1>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt />
                      <span>{listing.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt />
                      <span>
                        {listing.pickupDate
                          ? `Available: ${new Date(
                              listing.pickupDate
                            ).toLocaleDateString()}`
                          : "Available now"}
                      </span>
                    </div>
                    {listing.views && (
                      <div className="flex items-center gap-2">
                        <FaEye className="text-sm" />
                        <span>{listing.views} views</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl md:text-4xl font-bold mb-2">
                    {isFree ? (
                      <span className="text-green-300">Free Adoption</span>
                    ) : (
                      <>
                        <span className="text-yellow-300">
                          ৳{listing.price?.toLocaleString()}
                        </span>
                        {listing.category.slug !== "pets" && (
                          <span className="text-lg text-gray-300 ml-2">
                            each
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-4 justify-end">
                    <button
                      onClick={handleToggleLike}
                      className="flex items-center gap-2 text-white hover:text-pink-300 transition-colors"
                    >
                      <FaHeart
                        className={`text-xl ${
                          isLiked ? "text-pink-500 fill-pink-500" : ""
                        }`}
                      />
                      <span>{listing.likes?.length || 0}</span>
                    </button>
                    {!isFree && listing.category.slug === "pets" && (
                      <p className="text-gray-300">
                        Adoption fee covers vaccinations
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Info */}
              <div className="lg:col-span-2">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Description</h2>
                  <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                    {listing.description}
                  </p>
                </div>
              </div>

              {/* Sidebar */}
              <div>
                {/* Owner Info */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <FaPaw />
                    Owner Information
                  </h3>
                  <div className="space-y-4">
                    {listing.owner?.name && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Name
                        </p>
                        <p className="font-medium">
                          {listing.owner?.name || "Not available"}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Email
                      </p>
                      <p className="font-medium flex items-center gap-2">
                        <FaEnvelope className="text-gray-400" />
                        {listing.owner?.email}
                      </p>
                    </div>
                    {listing.owner?.phone && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Phone
                        </p>
                        <p className="font-medium flex items-center gap-2">
                          <FaPhone className="text-gray-400" />
                          {listing.owner.phone}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Card */}
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white">
                  <h3 className="text-xl font-bold mb-4">Interested?</h3>
                  <p className="mb-6">
                    {isFree
                      ? "Give this pet a loving home! Contact the owner or place an adoption request."
                      : "Ready to get this product? Place your order now!"}
                  </p>

                  <div className="space-y-4">
                    <button
                      onClick={() =>
                        user ? setShowOrderModal(true) : navigate("/login")
                      }
                      className="w-full bg-white hover:bg-gray-100 text-purple-600 font-bold py-4 px-6 rounded-lg text-lg transition-all duration-300 transform hover:scale-105"
                    >
                      {isFree ? "Adopt Now" : "Order Now"}
                    </button>

                    <a
                      href={`mailto:${listing.owner?.email}?subject=Regarding ${listing.owner?.name} on PawMart`}
                      className="w-full block text-center bg-white/20 hover:bg-white/30 backdrop-blur-sm py-3 px-6 rounded-lg font-medium transition-colors"
                    >
                      Contact Owner
                    </a>
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/30">
                    <p className="text-sm opacity-90">
                      <FaTag className="inline mr-2" />
                      {isFree ? "No adoption fee" : "Secure payment"}
                    </p>
                    <p className="text-sm opacity-90 mt-2">
                      <FaHome className="inline mr-2" />
                      Delivery/Meet-up arrangement
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold">
                    {isFree ? "Adoption Request" : "Place Order"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {listing.name}
                  </p>
                </div>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleOrderSubmit} className="space-y-4">
                {/* Product Info */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Product Name</p>
                      <p className="font-medium">{listing.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-medium">
                        {isFree
                          ? "Free"
                          : `৳${listing.price?.toLocaleString()}`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quantity (only for non-pets) */}
                {listing.category.slug !== "pets" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={orderForm.quantity}
                      onChange={handleInputChange}
                      min="1"
                      max={listing.quantity || 1}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Maximum available: {listing.quantity || 1}
                    </p>
                  </div>
                )}

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={orderForm.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                      placeholder="017XXXXXXXX"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Pick-up Date *
                    </label>
                    <input
                      type="date"
                      name="pickupDate"
                      value={orderForm.pickupDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                      required
                    />
                  </div>
                </div>

                {/* Address Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Street *
                    </label>
                    <input
                      type="text"
                      name="address.street"
                      value={orderForm.address.street}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                      placeholder="House #, Road #"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="address.city"
                      value={orderForm.address.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                      placeholder="City name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="address.state"
                      value={orderForm.address.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                      placeholder="State/Division"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Zip Code *
                    </label>
                    <input
                      type="text"
                      name="address.zipCode"
                      value={orderForm.address.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                      placeholder="Postal code"
                      required
                    />
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    name="additionalNotes"
                    value={orderForm.additionalNotes}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                    placeholder="Any special instructions or requests..."
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white py-4 px-6 rounded-lg font-bold text-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                        Processing...
                      </div>
                    ) : isFree ? (
                      "Submit Adoption Request"
                    ) : (
                      "Confirm Order"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ListingDetails;

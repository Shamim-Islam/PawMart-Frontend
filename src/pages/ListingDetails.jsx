
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaCalendarAlt, FaTag, FaEnvelope, FaPhone, FaHome, FaPaw } from 'react-icons/fa';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const ListingDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderForm, setOrderForm] = useState({
    buyerName: '',
    email: '',
    productId: '',
    productName: '',
    quantity: 1,
    price: 0,
    address: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    additionalNotes: ''
  });

  useEffect(() => {
    fetchListing();
  }, [id]);

  useEffect(() => {
    if (user && listing) {
      setOrderForm(prev => ({
        ...prev,
        buyerName: user.displayName || '',
        email: user.email || '',
        productId: listing._id || id,
        productName: listing.name,
        price: listing.price,
        quantity: listing.category === 'Pets' ? 1 : prev.quantity
      }));
    }
  }, [user, listing, id]);

  const fetchListing = async () => {
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        const mockListing = {
          _id: id,
          name: "Golden Retriever Puppy",
          category: "Pets",
          price: 0,
          location: "Dhaka",
          description: "Friendly 2-month-old puppy looking for a loving home. Vaccinated and healthy. Loves to play and is great with children.",
          image: "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
          email: "owner@example.com",
          date: "2024-01-15",
          additionalInfo: "Comes with vaccination records and starter kit",
          age: "2 months",
          breed: "Golden Retriever",
          ownerName: "John Doe",
          ownerPhone: "01712345678"
        };
        setListing(mockListing);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast.error('Failed to load listing details');
      setLoading(false);
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!orderForm.address.trim()) {
      toast.error('Please enter delivery address');
      return;
    }
    
    if (!orderForm.phone.trim()) {
      toast.error('Please enter phone number');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        console.log('Order placed:', orderForm);
        toast.success('Order placed successfully!');
        setShowOrderModal(false);
        setLoading(false);
        navigate('/my-orders');
      }, 1500);
    } catch (error) {
      toast.error('Failed to place order');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderForm(prev => ({
      ...prev,
      [name]: value
    }));
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
            onClick={() => navigate('/pets-supplies')}
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
          <div className="relative h-96 overflow-hidden">
            <img
              src={listing.image}
              alt={listing.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                    <span className="text-xl">
                      {listing.category === 'Pets' ? '🐶' :
                       listing.category === 'Food' ? '🍖' :
                       listing.category === 'Accessories' ? '🧸' : '💊'}
                    </span>
                    <span className="font-medium">{listing.category}</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">{listing.name}</h1>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt />
                      <span>{listing.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt />
                      <span>Available: {new Date(listing.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl md:text-4xl font-bold mb-2">
                    {isFree ? (
                      <span className="text-green-300">Free Adoption</span>
                    ) : (
                      <>
                        <span className="text-yellow-300">৳{listing.price}</span>
                        <span className="text-lg text-gray-300 ml-2">each</span>
                      </>
                    )}
                  </div>
                  {!isFree && listing.category === 'Pets' && (
                    <p className="text-gray-300">Adoption fee covers vaccinations</p>
                  )}
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

                {listing.additionalInfo && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-3">Additional Information</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {listing.additionalInfo}
                    </p>
                  </div>
                )}

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {listing.age && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Age</p>
                      <p className="text-lg font-semibold">{listing.age}</p>
                    </div>
                  )}
                  {listing.breed && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Breed</p>
                      <p className="text-lg font-semibold">{listing.breed}</p>
                    </div>
                  )}
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
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                      <p className="font-medium">{listing.ownerName || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <p className="font-medium flex items-center gap-2">
                        <FaEnvelope className="text-gray-400" />
                        {listing.email}
                      </p>
                    </div>
                    {listing.ownerPhone && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                        <p className="font-medium flex items-center gap-2">
                          <FaPhone className="text-gray-400" />
                          {listing.ownerPhone}
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
                      ? 'Give this pet a loving home! Contact the owner or place an adoption request.'
                      : 'Ready to get this product? Place your order now!'
                    }
                  </p>
                  
                  <div className="space-y-4">
                    <button
                      onClick={() => setShowOrderModal(true)}
                      className="w-full bg-white hover:bg-gray-100 text-purple-600 font-bold py-4 px-6 rounded-lg text-lg transition-all duration-300 transform hover:scale-105"
                    >
                      {isFree ? 'Adopt Now' : 'Order Now'}
                    </button>
                    
                    <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-3 px-6 rounded-lg font-medium transition-colors">
                      Contact Owner
                    </button>
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/30">
                    <p className="text-sm opacity-90">
                      <FaTag className="inline mr-2" />
                      {isFree ? 'No adoption fee' : 'Secure payment'}
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
                    {isFree ? 'Adoption Request' : 'Place Order'}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Product Name</label>
                    <input
                      type="text"
                      value={orderForm.productName}
                      readOnly
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Price</label>
                    <input
                      type="text"
                      value={isFree ? 'Free' : `৳${orderForm.price}`}
                      readOnly
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
                    />
                  </div>
                </div>

                {/* Quantity (only for non-pets) */}
                {listing.category !== 'Pets' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={orderForm.quantity}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                    />
                  </div>
                )}

                {/* Buyer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Name</label>
                    <input
                      type="text"
                      name="buyerName"
                      value={orderForm.buyerName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={orderForm.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                      required
                    />
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={orderForm.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Pick-up Date</label>
                    <input
                      type="date"
                      name="date"
                      value={orderForm.date}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                      required
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium mb-2">Address *</label>
                  <textarea
                    name="address"
                    value={orderForm.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                    placeholder="Enter delivery address or meeting location"
                    required
                  />
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium mb-2">Additional Notes</label>
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
                      'Submit Adoption Request'
                    ) : (
                      'Confirm Order'
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
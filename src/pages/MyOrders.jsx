import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  FaDownload,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaFilePdf,
  FaDollarSign,
} from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ordersAPI } from "../api/apiService";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalSpent: 0,
  });

  useEffect(() => {
  if (user?.email) {
    fetchMyOrders(user?.email);
    fetchOrderStats(user?.email);
  }
}, [user]);


  const fetchMyOrders = async (email) => {
    setLoading(true);
    try {
      const response = await ordersAPI.getMyOrders(email);
      setOrders(response.orders);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderStats = async (email) => {
  try {
    const data = await ordersAPI.getStats(email);
    setStats(data);
  } catch (error) {
    console.error("Error fetching order stats:", error);
  }
};

  const getStatusBadge = (status) => {
    const config = {
      pending: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        icon: FaClock,
      },
      confirmed: {
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        icon: FaCheckCircle,
      },
      processing: {
        color:
          "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
        icon: FaClock,
      },
      completed: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        icon: FaCheckCircle,
      },
      cancelled: {
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        icon: FaTimesCircle,
      },
    };

    const { color, icon: Icon } = config[status] || config.pending;
    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${color}`}
      >
        <Icon className="text-sm" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text("My Orders Report - PawMart", 14, 22);

    // Info
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);
    doc.text(`Customer: ${user?.name || "User"}`, 14, 38);
    doc.text(`Email: ${user?.email || ""}`, 14, 44);

    // Table
    autoTable(doc, {
      startY: 50,
      head: [
        ["Order ID", "Product", "Quantity", "Price", "Total", "Date", "Status"],
      ],
      body: orders.map((order) => [
        order._id.substring(0, 8),
        order.productName,
        order.quantity,
        `৳ ${order.price}`,
        `৳ ${order.price * order.quantity}`,
        formatDate(order.createdAt),
        order.status.toUpperCase(),
      ]),
      theme: "grid",
      headStyles: { fillColor: [79, 70, 229] },
      styles: { fontSize: 10 },
      margin: { top: 50 },
    });

    // Summary
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text("Summary:", 14, finalY);

    doc.text(`Total Orders: ${stats.totalOrders}`, 14, finalY + 8);
    doc.text(`Completed Orders: ${stats.completedOrders}`, 14, finalY + 16);
    doc.text(`Pending Orders: ${stats.pendingOrders}`, 14, finalY + 24);
    doc.text(
      `Total Amount: ৳ ${stats.totalSpent.toLocaleString()}`,
      14,
      finalY + 32
    );

    // Footer
    doc.setFontSize(10);
    doc.text("Thank you for using PawMart!", 14, finalY + 44);
    doc.text(
      "Contact: support@pawmart.com | Phone: +880 17XX-XXXXXX",
      14,
      finalY + 50
    );

    doc.save(`pawmart-orders-${new Date().toISOString().split("T")[0]}.pdf`);
    toast.success("PDF report downloaded successfully!");
  };

  const viewOrderDetails = async (order) => {
    try {
      const response = await ordersAPI.getById(order._id);
      setSelectedOrder(response.data.order);
      setShowOrderDetails(true);
    } catch (error) {
      toast.error("Failed to load order details");
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus);

      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }

      // Update stats
      if (newStatus === "completed") {
        setStats((prev) => ({
          ...prev,
          completedOrders: prev.completedOrders + 1,
          pendingOrders: prev.pendingOrders - 1,
        }));
      }

      toast.success(`Order marked as ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await ordersAPI.cancel(orderId);

      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: "cancelled" } : order
        )
      );

      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: "cancelled" }));
      }

      // Update stats
      setStats((prev) => ({
        ...prev,
        pendingOrders: prev.pendingOrders - 1,
      }));

      toast.success("Order cancelled successfully");
    } catch (error) {
      toast.error("Failed to cancel order");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                My Orders
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Track your adoption requests and product orders
              </p>
            </div>
            <button
              onClick={generatePDF}
              disabled={orders.length === 0}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              <FaDownload />
              Download Report (PDF)
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total Orders
                  </p>
                  <p className="text-2xl font-bold mt-1">{stats.totalOrders}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <FaFilePdf className="text-blue-600 dark:text-blue-300 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total Amount
                  </p>
                  <p className="text-2xl font-bold mt-1">
                    ৳{stats.totalSpent.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <FaDollarSign className="text-green-600 dark:text-green-300 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Completed
                  </p>
                  <p className="text-2xl font-bold mt-1">
                    {stats.completedOrders}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <FaCheckCircle className="text-purple-600 dark:text-purple-300 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Pending
                  </p>
                  <p className="text-2xl font-bold mt-1">
                    {stats.pendingOrders}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <FaClock className="text-yellow-600 dark:text-yellow-300 text-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
          >
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold mb-2">No orders yet</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your orders will appear here once you make a purchase or adoption
              request
            </p>
          </motion.div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Product
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Seller
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Quantity
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Total
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
                  {orders.map((order, index) => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {order.productId?.mainImage && (
                            <img
                              src={order.productId.mainImage}
                              alt={order.productName}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {order.productName}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              ৳{order.price} per item
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {order.seller ? (
                          <>
                            <p className="font-medium">{order.seller.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {order.seller.phone || order.seller.email}
                            </p>
                          </>
                        ) : (
                          <p className="text-gray-500">N/A</p>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-medium">{order.quantity}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-lg">
                          ৳{order.price * order.quantity?.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => viewOrderDetails(order)}
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                          >
                            <FaEye />
                            View
                          </button>

                          {order.status === "pending" && (
                            <>
                              <button
                                onClick={() =>
                                  handleStatusUpdate(order._id, "confirmed")
                                }
                                className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 text-sm"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => handleCancelOrder(order._id)}
                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold">Order Details</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Order ID: {selectedOrder._id.substring(0, 12)}...
                  </p>
                </div>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Product Information</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-500">Product:</span>
                        <p className="font-medium">
                          {selectedOrder.productName}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Quantity:</span>
                        <p className="font-medium">{selectedOrder.quantity}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">
                          Price per item:
                        </span>
                        <p className="font-medium">৳{selectedOrder.price}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Total:</span>
                        <p className="font-bold text-lg">
                          ৳{selectedOrder.totalAmount}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Buyer Information</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-500">Name:</span>
                        <p className="font-medium">{selectedOrder.buyerName}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Email:</span>
                        <p className="font-medium">{selectedOrder.email}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Phone:</span>
                        <p className="font-medium">{selectedOrder.phone}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">
                          Order Date:
                        </span>
                        <p className="font-medium">
                          {formatDate(selectedOrder.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address & Notes */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Delivery Information</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">Address:</span>
                      <p className="font-medium">
                        {selectedOrder.address.street},{" "}
                        {selectedOrder.address.city},
                        {selectedOrder.address.state}{" "}
                        {selectedOrder.address.zipCode},
                        {selectedOrder.address.country}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">
                        Pickup Date:
                      </span>
                      <p className="font-medium">
                        {formatDate(selectedOrder.pickupDate)}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Status:</span>
                      <div className="mt-1">
                        {getStatusBadge(selectedOrder.status)}
                      </div>
                    </div>
                    {selectedOrder.additionalNotes && (
                      <div>
                        <span className="text-sm text-gray-500">
                          Additional Notes:
                        </span>
                        <p className="font-medium mt-1">
                          {selectedOrder.additionalNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t dark:border-gray-700">
                  <button
                    onClick={() => setShowOrderDetails(false)}
                    className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-3 rounded-lg font-medium transition-colors"
                  >
                    Close
                  </button>
                  {selectedOrder.status === "pending" && (
                    <>
                      <button
                        onClick={() => {
                          handleStatusUpdate(selectedOrder._id, "confirmed");
                          setShowOrderDetails(false);
                        }}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                      >
                        Mark as Confirmed
                      </button>
                      <button
                        onClick={() => {
                          handleCancelOrder(selectedOrder._id);
                          setShowOrderDetails(false);
                        }}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                      >
                        Cancel Order
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;

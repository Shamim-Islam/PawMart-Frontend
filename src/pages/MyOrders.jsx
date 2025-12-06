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
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        const mockOrders = [
          {
            _id: "1",
            productId: "123",
            productName: "Golden Retriever Puppy",
            buyerName: "John Doe",
            email: user?.email,
            quantity: 1,
            price: 0,
            address: "123 Main St, Dhaka",
            phone: "01712345678",
            date: "2024-01-15",
            additionalNotes: "Please have vaccination records ready",
            status: "completed",
          },
          {
            _id: "2",
            productId: "124",
            productName: "Premium Dog Food",
            buyerName: "Jane Smith",
            email: user?.email,
            quantity: 2,
            price: 1200,
            address: "456 Park Ave, Chattogram",
            phone: "01898765432",
            date: "2024-01-10",
            additionalNotes: "Need delivery before weekend",
            status: "pending",
          },
          {
            _id: "3",
            productId: "125",
            productName: "Pet Carrier Bag",
            buyerName: "Bob Johnson",
            email: user?.email,
            quantity: 1,
            price: 2500,
            address: "789 Lake Road, Sylhet",
            phone: "01945678901",
            date: "2024-01-05",
            additionalNotes: "",
            status: "cancelled",
          },
        ];
        setOrders(mockOrders);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast.error("Failed to load orders");
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
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

  const calculateTotal = (order) => {
    return order.quantity * order.price;
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text("My Orders Report - PawMart", 14, 22);

    // Info
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);
    doc.text(`Customer: ${user?.displayName || "User"}`, 14, 38);

    // Table
    autoTable(doc, {
      startY: 45,
      head: [
        ["Order ID", "Product", "Quantity", "Price", "Total", "Date", "Status"],
      ],
      body: orders.map((order) => [
        order._id,
        order.productName,
        order.quantity,
        `৳${order.price}`,
        `৳${calculateTotal(order)}`,
        new Date(order.date).toLocaleDateString(),
        order.status.toUpperCase(),
      ]),
      theme: "grid",
      headStyles: { fillColor: [79, 70, 229] },
      styles: { fontSize: 10 },
      margin: { top: 45 },
    });

    // Summary
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text("Summary:", 14, finalY);

    const totalOrders = orders.length;
    const totalAmount = orders.reduce(
      (sum, order) => sum + calculateTotal(order),
      0
    );
    const completedOrders = orders.filter(
      (o) => o.status === "completed"
    ).length;

    doc.text(`Total Orders: ${totalOrders}`, 14, finalY + 8);
    doc.text(`Completed Orders: ${completedOrders}`, 14, finalY + 16);
    doc.text(`Total Amount: ৳${totalAmount}`, 14, finalY + 24);

    // Footer
    doc.setFontSize(10);
    doc.text("Thank you for using PawMart!", 14, finalY + 36);

    doc.save(`pawmart-orders-${new Date().toISOString().split("T")[0]}.pdf`);
    toast.success("PDF report downloaded successfully!");
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
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
                  <p className="text-2xl font-bold mt-1">{orders.length}</p>
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
                    ৳
                    {orders.reduce(
                      (sum, order) => sum + order.quantity * order.price,
                      0
                    )}
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
                    {orders.filter((o) => o.status === "completed").length}
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
                    {orders.filter((o) => o.status === "pending").length}
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
                      Order ID
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Product
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Buyer
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
                      <td className="py-4 px-6 font-mono text-sm text-gray-600 dark:text-gray-400">
                        #{order._id}
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {order.productName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          ৳{order.price} per item
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-medium">{order.buyerName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {order.phone}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-medium">{order.quantity}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-lg">
                          ৳{calculateTotal(order)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        >
                          <FaEye />
                          View
                        </button>
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
                    Order ID: #{selectedOrder._id}
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
                          ৳{calculateTotal(selectedOrder)}
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
                          {new Date(selectedOrder.date).toLocaleDateString()}
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
                      <p className="font-medium">{selectedOrder.address}</p>
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
                      <button className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-medium transition-colors">
                        Mark as Completed
                      </button>
                      <button className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-medium transition-colors">
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

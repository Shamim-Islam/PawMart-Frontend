import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import PetsSupplies from "./pages/PetsSupplies";
import AddListing from "./pages/AddListing";
import MyListings from "./pages/MyListings";
import MyOrders from "./pages/MyOrders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ListingDetails from "./pages/ListingDetails";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/PrivateRoute";
import ApiHealth from "./components/ApiHealth";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/pets-supplies" element={<PetsSupplies />} />
              <Route
                path="/category/:categoryName"
                element={<PetsSupplies />}
              />
              <Route
                path="/listing/:id"
                element={
                  <PrivateRoute>
                    <ListingDetails />
                  </PrivateRoute>
                }
              />
              <Route
                path="/add-listing"
                element={
                  <PrivateRoute>
                    <AddListing />
                  </PrivateRoute>
                }
              />
              <Route
                path="/my-listings"
                element={
                  <PrivateRoute>
                    <MyListings />
                  </PrivateRoute>
                }
              />
              <Route
                path="/my-orders"
                element={
                  <PrivateRoute>
                    <MyOrders />
                  </PrivateRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-right" />
          <ApiHealth />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

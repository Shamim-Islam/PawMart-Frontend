import axios from "axios";
import { toast } from "react-hot-toast";
import { useContext } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Handle specific error cases
      switch (status) {
        case 401:
          // Token expired or invalid
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
          toast.error("Session expired. Please login again.");
          break;

        case 403:
          toast.error("You are not authorized to perform this action.");
          break;

        case 404:
          toast.error("Resource not found.");
          break;

        case 500:
          toast.error("Server error. Please try again later.");
          break;

        default:
          if (data.message) {
            toast.error(data.message);
          } else {
            toast.error("An error occurred. Please try again.");
          }
      }
    } else if (error.request) {
      toast.error("Network error. Please check your connection.");
    } else {
      toast.error("An error occurred. Please try again.");
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    if (response.data.data.token) {
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  getMe: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put("/auth/update-profile", userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return api.post("/auth/logout");
  },
};

// Listings API
export const listingsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get("/listing", { params });
    return response.data;
  },

  getRecent: async (limit = 6) => {
    const response = await api.get("/listing/recent", {
      params: { limit },
    });
    return response.data;
  },

  getByCategory: async (category, params = {}) => {
    const response = await api.get(`/listing/category/${category}`, {
      params,
    });
    return response.data;
  },

  getCategoryCounts: async () => {
    const response = await api.get("/listing/category-counts");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/listing/${id}`);
    return response.data;
  },

  create: async (listingData) => {
    const response = await api.post("/listing", listingData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/listing/${id}`);
    return response.data;
  },

  getMyListings: async (email) => {
    const response = await api.get(`/my-listings?email=${email}`);
    const listingsData = response.data.listings;
    // console.log(response.data.listings);
    return listingsData;
  },

  toggleLike: async (id, userEmail) => {
    const response = await api.post(`/listing/${id}/like`, {
      userEmail,
    });
    return response.data;
  },
};

// Orders API
export const ordersAPI = {
  create: async (orderData) => {
    const response = await api.post("/orders", orderData);
    return response.data;
  },

  getMyOrders: async (email) => {
    const response = await api.get(`/orders/my-orders?email=${email}`);
    return response.data;
  },

  getReceivedOrders: async () => {
    const response = await api.get("/orders/received");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  },

  cancel: async (id) => {
    const response = await api.put(`/orders/${id}/cancel`);
    return response.data;
  },

  getStats: async (email) => {
    const response = await api.get(`/orders/stats?email=${email}`);
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  getFavorites: async (id) => {
    const response = await api.get(`/users/${id}/favorites`);
    return response.data;
  },

  addFavorite: async (listingId) => {
    const response = await api.post(`/users/favorites/${listingId}`);
    return response.data;
  },

  removeFavorite: async (listingId) => {
    const response = await api.delete(`/users/favorites/${listingId}`);
    return response.data;
  },

  getTopSellers: async () => {
    const response = await api.get("/users/top-sellers");
    return response.data;
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    const response = await api.get("/health");
    return response.data;
  },
};

export default api;

import React, { useState, useEffect } from "react";
import { healthAPI } from "../api/apiService";
import { FaCheckCircle, FaTimesCircle, FaDatabase } from "react-icons/fa";

const ApiHealth = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkHealth();
    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    try {
      const response = await healthAPI.check();
      setHealth(response);
    } catch (error) {
      setHealth({
        status: "error",
        message: "API connection failed",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  const isHealthy = health?.status === "success";

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg ${
          isHealthy
            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
        }`}
      >
        {isHealthy ? (
          <FaCheckCircle className="text-green-600 dark:text-green-400" />
        ) : (
          <FaTimesCircle className="text-red-600 dark:text-red-400" />
        )}
        <span className="text-sm font-medium">
          {isHealthy ? "API Connected" : "API Disconnected"}
        </span>
        {health?.database && (
          <div className="flex items-center gap-1 ml-2">
            <FaDatabase className="text-xs" />
            <span className="text-xs">
              {health.database === "connected" ? "DB ✓" : "DB ✗"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiHealth;

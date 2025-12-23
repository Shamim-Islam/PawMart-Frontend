import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { FaPaw, FaHeart, FaSearch, FaStar } from "react-icons/fa";
import CategoryCard from "../components/CategoryCard";
import ListingCard from "../components/ListingCard";
import LoadingSpinner from "../components/LoadingSpinner";
import Carousel from "../components/Carousel";
import { listingsAPI } from "../api/apiService";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [recentListings, setRecentListings] = useState([]);

  useEffect(() => {
    fetchRecentListings();
  }, []);

  const fetchRecentListings = async () => {
    try {
      setLoading(true);
      const response = await listingsAPI.getRecent();
      setRecentListings(response.listings);
    } catch (error) {
      console.error("Error fetching recent listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const [categories, setCategories] = useState([
    {
      name: "Pets (Adoption)",
      slug: "pets",
      icon: "🐶",
      color: "from-blue-500 to-cyan-400",
      count: 0,
    },
    {
      name: "Pet Food",
      slug: "pet-food",
      icon: "🍖",
      color: "from-green-500 to-emerald-400",
      count: 0,
    },
    {
      name: "Accessories",
      slug: "accessories",
      icon: "🧸",
      color: "from-purple-500 to-pink-400",
      count: 0,
    },
    {
      name: "Pet Care Products",
      slug: "pet-care-products",
      icon: "💊",
      color: "from-red-500 to-orange-400",
      count: 0,
    },
  ]);

  useEffect(() => {
    fetchCategoryCounts();
  }, []);

  const fetchCategoryCounts = async () => {
    try {
      const res = await listingsAPI.getCategoryCounts();
      const counts = res.counts; 

      setCategories((prev) =>
        prev.map((cat) => {
          const matched = counts.find((c) => c._id === cat.slug);
          return matched ? { ...cat, count: matched.count } : cat;
        })
      );
    } catch (err) {
      console.error("Failed to load category counts", err);
    }
  };

  const petHeroes = [
    {
      name: "Sarah Johnson",
      pet: "Rescued 15 dogs",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      story: "Animal rights activist with 5 years of rescue experience",
      rating: "4.9",
    },
    {
      name: "Michael Chen",
      pet: "Adopted 3 cats",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      story: "Foster parent for kittens and advocate for spaying/neutering",
      rating: "4.8",
    },
    {
      name: "Emma Wilson",
      pet: "Foster caregiver",
      image:
        "https://images.unsplash.com/photo-1556575533-7190b053c299?q=80&w=1954&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      story: "Has fostered over 50 pets in the last 3 years",
      rating: "5.0",
    },
    {
      name: "David Park",
      pet: "Volunteer at shelter",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      story: "Weekend volunteer and adoption counselor",
      rating: "4.7",
    },
  ];

  return (
    <div>
      {/* Banner Section - Carousel */}
      <section className="py-4 md:py-16 bg-[url('https://i.ibb.co.com/5gJb5BWW/bg.png')] bg-cover bg-center bg-no-repeat">
        <div className="container mx-auto px-4">
          <Carousel />
        </div>
      </section>

      {/* Category Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Browse by <span className="text-purple-600">Category</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/pets-supplies?category=${category?.slug}`}
              >
                <CategoryCard category={category} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Listings */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Recent Listings</h2>
            <Link
              to="/pets-supplies"
              className="text-purple-600 hover:text-purple-700 font-semibold flex items-center"
            >
              View All <span className="ml-2">→</span>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentListings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Adopt Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Adopt from <span className="text-purple-600">PawMart</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <div className="flex items-start space-x-4">
                  <FaHeart className="text-red-500 text-2xl mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold">Save a Life</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Every adoption means one less animal in a shelter and one
                      more life saved.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <FaStar className="text-yellow-500 text-2xl mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold">Health Benefits</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Adopted pets are often vaccinated, spayed/neutered, and
                      ready for their forever homes.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <FaPaw className="text-purple-500 text-2xl mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold">Community Support</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Join our community of responsible pet owners and get
                      ongoing support and advice.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Happy adopted dog"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg">
                <p className="font-bold text-lg">"Best decision ever!"</p>
                <p className="text-gray-600 dark:text-gray-300">
                  - Happy Adopter
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pet Heroes Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Meet Our <span className="text-purple-600">Pet Heroes</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {petHeroes.map((hero, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={hero.image}
                  alt={hero.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">{hero.name}</h3>
                  <p className="text-purple-600 font-semibold mb-2">
                    {hero.pet}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {hero.story}
                  </p>
                  <div className="mt-4">
                    <span className="text-yellow-500">{hero.rating}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

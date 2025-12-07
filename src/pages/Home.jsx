import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { FaPaw, FaHeart, FaSearch, FaStar } from "react-icons/fa";
import CategoryCard from "../components/CategoryCard";
import ListingCard from "../components/ListingCard";
import LoadingSpinner from "../components/LoadingSpinner";
import Carousel from "../components/Carousel";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [recentListings, setRecentListings] = useState([]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRecentListings([
        {
          id: 1,
          name: "Golden Retriever Puppy",
          category: "Pets",
          price: 0,
          location: "Dhaka",
          image:
            "https://images.unsplash.com/photo-1611003229186-80e40cd54966?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          description: "Friendly 2-month-old puppy looking for a loving home.",
        },
        {
          id: 2,
          name: "Premium Dog Food",
          category: "Food",
          price: 1200,
          location: "Chattogram",
          image:
            "https://images.unsplash.com/photo-1608408891486-f5cade977d19?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          description: "High-quality dog food for all breeds.",
        },
        {
          id: 3,
          name: "Pet Carrier Bag",
          category: "Accessories",
          price: 2500,
          location: "Sylhet",
          image:
            "https://images.unsplash.com/photo-1608060375223-c5ab552bc9a9?q=80&w=2081&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          description: "Comfortable pet carrier for travel.",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const categories = [
    {
      name: "Pets (Adoption)",
      icon: "🐶",
      count: 24,
      color: "from-blue-500 to-cyan-400",
    },
    {
      name: "Pet Food",
      icon: "🍖",
      count: 56,
      color: "from-green-500 to-emerald-400",
    },
    {
      name: "Accessories",
      icon: "🧸",
      count: 42,
      color: "from-purple-500 to-pink-400",
    },
    {
      name: "Pet Care Products",
      icon: "💊",
      count: 18,
      color: "from-red-500 to-orange-400",
    },
  ];

  const petHeroes = [
    {
      name: "Sarah Johnson",
      pet: "Rescued 15 dogs",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    },
    {
      name: "Michael Chen",
      pet: "Adopted 3 cats",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    },
    {
      name: "Emma Wilson",
      pet: "Foster caregiver",
      image:
        "https://images.unsplash.com/photo-1556575533-7190b053c299?q=80&w=1954&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "David Park",
      pet: "Volunteer at shelter",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    },
  ];

  return (
    <div>
      {/* Banner Section - Carousel */}
      <section className="py-4 md:py-16 bg-[url('https://i.ibb.co.com/5gJb5BWW/bg.png')] bg-cover bg-center bg-no-repeat ">
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
              <CategoryCard key={index} category={category} />
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
                <ListingCard key={listing.id} listing={listing} />
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
                    Active member of PawMart community
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  // return (
  //   <div>
  //     {/* Banner Section */}
  //     <div className="relative bg-gradient-to-r from-purple-600 to-pink-500 text-white overflow-hidden">
  //       <div className="absolute inset-0 bg-black opacity-20"></div>
  //       <div className="container mx-auto px-4 py-24 relative z-10">
  //         <motion.div
  //           initial={{ opacity: 0, y: 20 }}
  //           animate={{ opacity: 1, y: 0 }}
  //           transition={{ duration: 0.8 }}
  //           className="text-center"
  //         >
  //           <h1 className="text-5xl md:text-6xl font-bold mb-6">
  //             <Typewriter
  //               words={[
  //                 "Find Your Furry Friend Today!",
  //                 "Adopt, Don't Shop",
  //                 "Every Pet Deserves Love",
  //               ]}
  //               loop={true}
  //               cursor
  //               cursorStyle="|"
  //               typeSpeed={70}
  //               deleteSpeed={50}
  //               delaySpeed={1000}
  //             />
  //           </h1>
  //           <p className="text-xl md:text-2xl mb-8">
  //             Because Every Pet Deserves Love and Care
  //           </p>
  //           <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
  //             <Link
  //               to="/pets-supplies"
  //               className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105"
  //             >
  //               <FaSearch className="inline mr-2" />
  //               Browse Listings
  //             </Link>
  //             <Link
  //               to="/add-listing"
  //               className="bg-yellow-400 text-gray-800 hover:bg-yellow-500 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105"
  //             >
  //               <FaPaw className="inline mr-2" />
  //               List a Pet/Product
  //             </Link>
  //           </div>
  //         </motion.div>
  //       </div>
  //     </div>

  //     {/* Category Section */}
  //     <section className="py-16 bg-gray-50 dark:bg-gray-800">
  //       <div className="container mx-auto px-4">
  //         <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
  //           Browse by <span className="text-purple-600">Category</span>
  //         </h2>
  //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  //           {categories.map((category, index) => (
  //             <CategoryCard key={index} category={category} />
  //           ))}
  //         </div>
  //       </div>
  //     </section>

  //     {/* Recent Listings */}
  //     <section className="py-16">
  //       <div className="container mx-auto px-4">
  //         <div className="flex justify-between items-center mb-8">
  //           <h2 className="text-3xl font-bold">Recent Listings</h2>
  //           <Link
  //             to="/pets-supplies"
  //             className="text-purple-600 hover:text-purple-700 font-semibold flex items-center"
  //           >
  //             View All <span className="ml-2">→</span>
  //           </Link>
  //         </div>

  //         {loading ? (
  //           <div className="flex justify-center py-12">
  //             <LoadingSpinner />
  //           </div>
  //         ) : (
  //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  //             {recentListings.map((listing) => (
  //               <ListingCard key={listing.id} listing={listing} />
  //             ))}
  //           </div>
  //         )}
  //       </div>
  //     </section>

  //     {/* Why Adopt Section */}
  //     <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
  //       <div className="container mx-auto px-4">
  //         <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
  //           Why Adopt from <span className="text-purple-600">PawMart</span>?
  //         </h2>
  //         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
  //           <div>
  //             <motion.div
  //               initial={{ opacity: 0, x: -20 }}
  //               whileInView={{ opacity: 1, x: 0 }}
  //               transition={{ duration: 0.6 }}
  //               className="space-y-4"
  //             >
  //               <div className="flex items-start space-x-4">
  //                 <FaHeart className="text-red-500 text-2xl mt-1" />
  //                 <div>
  //                   <h3 className="text-xl font-semibold">Save a Life</h3>
  //                   <p className="text-gray-600 dark:text-gray-300">
  //                     Every adoption means one less animal in a shelter and one
  //                     more life saved.
  //                   </p>
  //                 </div>
  //               </div>
  //               <div className="flex items-start space-x-4">
  //                 <FaStar className="text-yellow-500 text-2xl mt-1" />
  //                 <div>
  //                   <h3 className="text-xl font-semibold">Health Benefits</h3>
  //                   <p className="text-gray-600 dark:text-gray-300">
  //                     Adopted pets are often vaccinated, spayed/neutered, and
  //                     ready for their forever homes.
  //                   </p>
  //                 </div>
  //               </div>
  //               <div className="flex items-start space-x-4">
  //                 <FaPaw className="text-purple-500 text-2xl mt-1" />
  //                 <div>
  //                   <h3 className="text-xl font-semibold">Community Support</h3>
  //                   <p className="text-gray-600 dark:text-gray-300">
  //                     Join our community of responsible pet owners and get
  //                     ongoing support and advice.
  //                   </p>
  //                 </div>
  //               </div>
  //             </motion.div>
  //           </div>
  //           <motion.div
  //             initial={{ opacity: 0, scale: 0.9 }}
  //             whileInView={{ opacity: 1, scale: 1 }}
  //             transition={{ duration: 0.6 }}
  //             className="relative"
  //           >
  //             <img
  //               src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  //               alt="Happy adopted dog"
  //               className="rounded-2xl shadow-2xl"
  //             />
  //             <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg">
  //               <p className="font-bold text-lg">"Best decision ever!"</p>
  //               <p className="text-gray-600 dark:text-gray-300">
  //                 - Happy Adopter
  //               </p>
  //             </div>
  //           </motion.div>
  //         </div>
  //       </div>
  //     </section>

  //     {/* Pet Heroes Section */}
  //     <section className="py-16">
  //       <div className="container mx-auto px-4">
  //         <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
  //           Meet Our <span className="text-purple-600">Pet Heroes</span>
  //         </h2>
  //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  //           {petHeroes.map((hero, index) => (
  //             <motion.div
  //               key={index}
  //               initial={{ opacity: 0, y: 20 }}
  //               whileInView={{ opacity: 1, y: 0 }}
  //               transition={{ duration: 0.5, delay: index * 0.1 }}
  //               whileHover={{ y: -10 }}
  //               className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
  //             >
  //               <img
  //                 src={hero.image}
  //                 alt={hero.name}
  //                 className="w-full h-48 object-cover"
  //               />
  //               <div className="p-6 text-center">
  //                 <h3 className="text-xl font-bold mb-2">{hero.name}</h3>
  //                 <p className="text-purple-600 font-semibold mb-2">
  //                   {hero.pet}
  //                 </p>
  //                 <p className="text-gray-600 dark:text-gray-300 text-sm">
  //                   Active member of PawMart community
  //                 </p>
  //               </div>
  //             </motion.div>
  //           ))}
  //         </div>
  //       </div>
  //     </section>
  //   </div>
  // );
};

export default Home;

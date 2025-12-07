
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaPaw } from 'react-icons/fa';

const Carousel = () => {
  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1800&q=80",
      title: "Find Your Furry Friend Today!",
      description: "Thousands of loving pets waiting for their forever homes.",
      buttonText: "Browse Pets",
      buttonLink: "/pets-supplies?category=pets"
    },
    {
      id: 2,
      image: "https://i.ibb.co.com/VcWsFM4y/background-04-copyright.jpg",
      title: "Quality Pet Supplies",
      description: "Everything your pet needs - food, toys, accessories, and care products.",
      buttonText: "Shop Supplies",
      buttonLink: "/pets-supplies"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1800&q=80",
      title: "Adopt, Don't Shop",
      description: "Give a shelter pet a second chance at a happy life.",
      buttonText: "Learn More",
      buttonLink: "#why-adopt"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1800&q=80",
      title: "Happy Owners, Happy Pets",
      description: "Join our community of satisfied pet owners and adopters.",
      buttonText: "View Stories",
      buttonLink: "#pet-heroes"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentIndex, isAutoPlaying]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => 
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 }
      }
    },
    exit: (direction) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 }
      }
    })
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.6
      }
    }
  };

  return (
    <div 
      className="relative h-[600px] md:h-[700px] overflow-hidden rounded-2xl shadow-2xl"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Slides */}
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <img
            src={slides[currentIndex].image}
            alt={slides[currentIndex].title}
            className="w-full h-full object-cover"
          />
          
          {/* Content Overlay */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-8 md:px-12 lg:px-16">
              <motion.div
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="max-w-2xl text-white"
              >
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                  <FaPaw className="text-xl" />
                  <span className="font-semibold">PawMart</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
                  {slides[currentIndex].title}
                </h1>
                
                <p className="text-xl md:text-2xl mb-8 opacity-90">
                  {slides[currentIndex].description}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={slides[currentIndex].buttonLink}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    {slides[currentIndex].buttonText}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                  
                  <button
                    onClick={() => goToSlide(currentIndex === slides.length - 1 ? 0 : currentIndex + 1)}
                    className="inline-flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-4 rounded-full text-lg font-semibold transition-all duration-300"
                  >
                    Skip to Next
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
        aria-label="Previous slide"
      >
        <FaChevronLeft size={24} />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
        aria-label="Next slide"
      >
        <FaChevronRight size={24} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-125'
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute top-6 right-6 bg-black/30 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
        <span className="font-bold">{currentIndex + 1}</span>
        <span className="opacity-70"> / {slides.length}</span>
      </div>

      {/* Auto-play Indicator */}
      <div className="absolute bottom-6 right-6 flex items-center gap-2">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="bg-black/30 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/40 transition-colors"
          aria-label={isAutoPlaying ? "Pause auto-play" : "Play auto-play"}
        >
          {isAutoPlaying ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        <span className="text-xs text-white/70">Auto-play</span>
      </div>
    </div>
  );
};

export default Carousel;
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import useProductState from "../store/useProductStore";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";

const CategoryPage = () => {
  const { category } = useParams();
  const { fetchProductByCategory, products } = useProductState();

  useEffect(() => {
    if (!category) return;
    fetchProductByCategory(category);
  }, [category]);

  return (
    <div className="min-h-screen">
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h1
          className="text-center text-4xl  sm:text-5xl text-emerald-500 font-bold mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {category && category?.charAt(0).toUpperCase() + category?.slice(1)}
        </motion.h1>
      </div>
      <motion.div
        className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center px-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <h2 className="text-3xl font-semibold text-gray-300 text-center col-span-full">
            No products found
          </h2>
        )}
      </motion.div>
    </div>
  );
};

export default CategoryPage;

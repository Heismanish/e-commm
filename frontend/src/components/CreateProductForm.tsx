import { motion } from "framer-motion";
import { Loader, PlusCircle, Upload } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import useProductState from "../store/useProductStore";
import Product from "../Types/product.type";

const categories: string[] = [
  "Jeans",
  "T-shirt",
  "Shoes",
  "Glasses",
  "Jackets",
  "Suit",
  "Bag",
];
const CreateProductForm = () => {
  const { createProduct, loading } = useProductState();
  const [product, setProduct] = useState<Product>({
    name: "",
    description: "",
    price: 0,
    category: "",
    image: "",
    isFeatured: false,
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    try {
      createProduct(product);
      setProduct({
        name: "",
        description: "",
        price: 0,
        category: "",
        image: "",
        isFeatured: false,
      });
    } catch (error) {
      console.log("Error creating product", error);
    }
  }

  function handleImageChange(e: ChangeEvent<HTMLInputElement>): void {
    // converting file to base64
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProduct({ ...product, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg p-4 sm:p-8 mb-8 max-w-xl mx-auto"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl text-emerald-300 font-semibold mb-6 text-center">
        Create New Product
      </h2>

      <form onSubmit={handleSubmit} className="sm:space-y-6 space-y-6 ">
        <div>
          <label
            htmlFor="name"
            className="text-gray-300 text-sm font-medium block"
          >
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={product.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setProduct({ ...product, name: e.target.value })
            }
            className="mt-2 block w-full py-2 px-3 rounded-md bg-gray-700  border border-gray-600 shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 "
            required
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="text-gray-300 text-sm font-medium block"
          >
            Product Description
          </label>
          <textarea
            id="description"
            name="description"
            value={product.description}
            rows={3}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setProduct({ ...product, description: e.target.value })
            }
            className="mt-2 block w-full py-2 px-3 rounded-md bg-gray-700  border border-gray-600 shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 "
            required
          />
        </div>
        <div>
          <label
            htmlFor="price"
            className="text-gray-300 text-sm font-medium block"
          >
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={product.price}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setProduct({ ...product, price: parseFloat(e.target.value) })
            }
            step="0.01"
            className="mt-2 block w-full py-2 px-3 rounded-md bg-gray-700  border border-gray-600 shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 "
            required
          />
        </div>
        <div>
          <label
            htmlFor="category"
            className="text-gray-300 text-sm font-medium block"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={product.category}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setProduct({ ...product, category: e.target.value })
            }
            className="mt-2 block w-full py-2 px-3 rounded-md bg-gray-700  border border-gray-600 shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 "
            required
          >
            <option value={""}>Select a value</option>
            {categories.map((category, idx) => (
              <option key={idx} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center ">
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            className="sr-only"
            onChange={handleImageChange}
            required
          />
          <label
            htmlFor="image"
            className=" flex flex-wrap items-center   text-gray-300 text-sm  cursor-pointer px-3 py-2 bg-gray-700 broder border-gray-600 shadow-sm leading-4 font-medium rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 "
          >
            <Upload className="w-5 h-5 mr-2 inline-block" />
            <span>Upload Image</span>
          </label>
          {product.image && (
            <span className="text-gray-340 text-sm font-medium block ml-2  overflow-x-auto">
              Image Uploaded
            </span>
          )}
        </div>

        <button
          type="submit"
          className=" w-full flex items-center justify-center px-4 py-2 border-transparent text-white text-sm font-medium rounded-md shadow-sm bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader
                className="w-5 h-5 mr-2 inline-block animate-spin"
                aria-hidden="true"
              />
              Loading...
            </>
          ) : (
            <>
              <PlusCircle className="w-5 h-5 mr-2  inline-block" />
              Create Product
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default CreateProductForm;

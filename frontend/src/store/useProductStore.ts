import toast from "react-hot-toast";
import { create } from "zustand";
import axios from "../lib/axios";
import { AxiosError } from "axios";

export type Product = {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isFeatured: boolean;
};

type ProductStateType = {
  products: Product[];
  loading: boolean;
  setProducts: (products: Product[]) => void;
  createProduct: (productData: Product) => Promise<void>;
  fetchAllProducts: () => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  toggleFeaturedProduct: (productId: string) => Promise<void>;
};

const useProductState = create<ProductStateType>()((set) => ({
  products: [],
  loading: false,
  setProducts: (products: Product[]) => set({ products: products }),
  createProduct: async (productData: Product) => {
    set({ loading: true });
    try {
      const res = await axios.post("/product", productData);

      set((prevState) => ({
        products: [...prevState.products, res.data.product],
        loading: false,
      }));

      toast.success("Product created successfully!!");
    } catch (error: AxiosError | any) {
      toast.error("Failed to create product", error.response.data.error);
      console.log(error);
      set({ loading: false });
    }
  },
  fetchAllProducts: async () => {
    try {
      const res = await axios.get("/product");
      set({ products: res.data.products });
    } catch (error) {
      console.log(error);
    }
  },
  deleteProduct: async (productId: string) => {
    set({ loading: true });
    try {
      const res = await axios.delete(`/product/${productId}`);
      set((prev) => ({
        products: prev.products.filter((product) => product._id !== productId),
        loading: false,
      }));
      toast.success("Product deleted successfully!!");
    } catch (error: AxiosError | any) {
      toast.error("Failed to delete product", error.response.data.error);
      console.log(error);
      set({ loading: false });
    }
  },
  toggleFeaturedProduct: async (productId: string) => {
    set({ loading: true });
    try {
      const res = await axios.patch(`/product/${productId}`);
      set((prev) => ({
        products: prev.products.map((product) => {
          if (product._id === productId) {
            return { ...product, isFeatured: !product.isFeatured };
          }
          return product;
        }),
        loading: false,
      }));
      toast.success("Product updated successfully!!");
    } catch (error: AxiosError | any) {
      toast.error("Failed to update product", error.response.data.error);
      console.log(error);
      set({ loading: false });
    }
  },
}));

export default useProductState;

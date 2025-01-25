import toast from "react-hot-toast";
import { create } from "zustand";
import axios from "../lib/axios";
import { AxiosError, isAxiosError } from "axios";
import Product from "../Types/product.type";

type ProductStateType = {
  products: Product[];
  loading: boolean;
  featuredProducts: Product[];
  setProducts: (products: Product[]) => void;
  createProduct: (productData: Product) => Promise<void>;
  fetchAllProducts: () => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  toggleFeaturedProduct: (productId: string) => Promise<void>;
  fetchProductByCategory: (category: string) => Promise<void>;
  getFeaturedProducts: () => Promise<void>;
};

const useProductState = create<ProductStateType>()((set) => ({
  products: [],
  loading: false,
  featuredProducts: [],
  setProducts: (products: Product[]) => set({ products: products }),
  createProduct: async (productData: Product) => {
    set({ loading: true });
    try {
      const res = await axios.post("/product", productData);

      set((prevState) => ({
        products: [...prevState.products, res?.data?.product],
        loading: false,
      }));

      toast.success("Product created successfully!!", { id: "create" });
    } catch (error: AxiosError | any) {
      if (isAxiosError(error)) {
        toast.error(
          "Failed to create product: " + error?.response?.data.error,
          {
            id: "create",
          }
        );
      } else toast.error("Failed to create product", { id: "create" });
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
      toast.success("Product deleted successfully!!", { id: "delete" });
    } catch (error: AxiosError | any) {
      if (isAxiosError(error))
        toast.error(
          "Failed to delete product: " + error?.response?.data.error,
          {
            id: "delete",
          }
        );
      else toast.error("Failed to delete product", { id: "delete" });
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
      toast.success("Product updated successfully!!", { id: "toggleFeatured" });
    } catch (error: AxiosError | any) {
      if (isAxiosError(error))
        toast.error(
          "Failed to update product: " + error?.response?.data.message,
          { id: "toggleFeatured" }
        );
      else toast.error("Failed to update product", { id: "toggleFeatured" });
      console.log(error);
      set({ loading: false });
    }
  },
  fetchProductByCategory: async (category: string) => {
    set({ loading: true });
    try {
      const res = await axios.get(`/product/category/${category}`);
      console.log(res.data);
      set({
        products: res.data.categoryProduct,
        loading: false,
      });
    } catch (error: AxiosError | any) {
      set({ loading: false });
      console.log(error);
      if (isAxiosError(error)) {
        toast.error(
          "Failed to fetch products: " + error?.response?.data.error,
          {
            id: "category",
          }
        );
      } else {
        toast.error("Failed to fetch products ", { id: "category" });
      }
    }
  },
  getFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/product/featured");

      set({
        featuredProducts: res?.data,
      });
    } catch (error: AxiosError | any) {
      console.log("Error while fetching featured products: ", error);
    } finally {
      set({ loading: false });
    }
  },
}));

export default useProductState;

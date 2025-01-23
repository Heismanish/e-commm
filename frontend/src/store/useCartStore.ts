import { create } from "zustand";
import Product from "../Types/product.type";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import Coupon from "../Types/coupon.types";

export interface ICart extends Product {
  quantity: number;
}

type typeCartStore = {
  cart: ICart[];
  coupon: Coupon | null;
  total: number;
  subtotal: number;
  getCartItems: () => Promise<void>;
  addToCart: (product: Product) => Promise<void>;
  calculateTotal: () => { total: number; subTotal: number };
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
};

const useCartStore = create<typeCartStore>()((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,
  getCartItems: async () => {
    try {
      const res = await axios.get("/cart");

      set({
        cart: res.data,
      });
      get().calculateTotal();
    } catch (error) {
      set({ cart: [] });
      toast.error("Failed to get cart items");
    }
  },

  addToCart: async (product: Product) => {
    try {
      const res = await axios.post("/cart", { productId: product._id });

      toast.success("Product added to cart", { id: "cart" });
      // handle the edge case:
      // 1. when product already exist in the cart.
      // 2. when product does not exist in the cart.

      get().calculateTotal();
      set((prev) => {
        const existingItem = prev.cart.find((item) => item._id === product._id);
        if (existingItem) {
          return {
            cart: prev.cart.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          };
        } else {
          return { cart: [...prev.cart, { ...product, quantity: 1 }] };
        }
      });
    } catch (error: AxiosError | any) {
      console.log(error.response.data.message);
      toast.error(
        "Failed to add product to cart " + error.response.data.message
      );
    }
  },
  calculateTotal: () => {
    const { cart, coupon } = get();
    const subTotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    let total = subTotal;
    if (coupon) {
      total = subTotal - (subTotal * coupon.discountPercentage) / 100;
    }

    return { total, subTotal };
  },
  removeFromCart: async (productId: string) => {
    try {
      const res = await axios.delete(`/cart/${productId}`);
      get().calculateTotal();
      toast.success("Product removed from cart", { id: "cart" });
      set((prev) => ({
        cart: prev.cart.filter((item) => item._id !== productId),
      }));
    } catch (error: AxiosError | any) {
      console.log(error.response.data.message);
      toast.error(
        "Failed to remove product from cart" + error.response.data.message
      );
    }
  },

  updateQuantity: async (productId: string, quantity: number) => {},
}));

export default useCartStore;

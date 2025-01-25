import { create } from "zustand";
import Product from "../Types/product.type";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import { AxiosError, isAxiosError } from "axios";
import Coupon from "../Types/coupon.types";

export interface ICart extends Product {
  quantity: number;
}

type typeCartStore = {
  cart: ICart[];
  coupon: Coupon | null;
  total: number;
  subtotal: number;
  isCouponApplied: boolean;
  getCartItems: () => Promise<void>;
  addToCart: (product: Product) => Promise<void>;
  calculateTotal: () => void;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getMyCoupon: () => Promise<void>;
  applyCoupon: (couponCode: string) => Promise<void>;
  removeCoupon: () => void;
};

const useCartStore = create<typeCartStore>()((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,
  isCouponApplied: false,
  getCartItems: async () => {
    try {
      const res = await axios.get("/cart");

      set({
        cart: res.data,
      });
      get().calculateTotal();
    } catch (error: AxiosError | any) {
      set({ cart: [] });
      if (isAxiosError(error))
        toast.error(
          "Failed to get cart items: " + error?.response?.data?.message,
          { id: "get_cart" }
        );
      else toast.error("Failed to get cart items.", { id: "get_cart" });
    }
  },

  addToCart: async (product: Product) => {
    try {
      const res = await axios.post("/cart", { productId: product._id });

      toast.success("Product added to cart", { id: "add_cart" });
      // handle the edge case:
      // 1. when product already exist in the cart.
      // 2. when product does not exist in the cart.

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
      get().calculateTotal();
    } catch (error: AxiosError | any) {
      console.log(error.response.data.message);
      if (isAxiosError(error))
        toast.error(
          "Failed to add product to cart: " + error?.response?.data.message,
          { id: "add_cart" }
        );
      else toast.error("Failed to add product to cart ", { id: "add_cart" });
    }
  },
  calculateTotal: () => {
    const { cart, coupon } = get();
    const subTotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    let total = subTotal;
    if (coupon && get().isCouponApplied) {
      total = subTotal - (subTotal * coupon.discountPercentage) / 100;
    }
    set({ total, subtotal: subTotal });
  },

  removeFromCart: async (productId: string) => {
    try {
      const res = await axios.delete(`/cart/${productId}`);
      toast.success("Product removed from cart", { id: "remove_cart" });
      set((prev) => ({
        cart: prev.cart.filter((item) => item._id !== productId),
      }));
      get().calculateTotal();
    } catch (error: AxiosError | any) {
      console.log(error.response.data.message);
      if (isAxiosError(error))
        toast.error(
          "Failed to remove product from cart: " +
            error?.response?.data.message,
          { id: "remove_cart" }
        );
      else
        toast.error("Failed to remove product from cart.", {
          id: "remove_cart",
        });
    }
  },

  updateQuantity: async (productId: string, quantity: number) => {
    if (quantity === 0) {
      get().removeFromCart(productId);
      return;
    }
    try {
      const res = await axios.put(`/cart/${productId}`, { quantity });
      toast.success("Product quantity updated in cart", { id: "cart" });
      set((prev) => ({
        cart: prev.cart.map((item) =>
          item._id === productId ? { ...item, quantity } : item
        ),
      }));
      get().calculateTotal();
    } catch (error: AxiosError | any) {
      console.log(error.response.data.message);
      if (isAxiosError(error))
        toast.error(
          "Failed to update product quantity in cart: " +
            error?.response?.data.message,
          { id: "cart" }
        );
      else
        toast.error("Failed to update product quantity in cart", {
          id: "cart",
        });
    }
  },
  clearCart: async () => {
    try {
      // Send a request to the backend to clear the cart in the database
      await axios.delete("/cart");

      // Update the client-side cart state
      set({ cart: [], coupon: null, total: 0, subtotal: 0 });

      toast.success("Cart cleared!", { id: "cart" });
    } catch (error: AxiosError | any) {
      if (isAxiosError(error))
        toast.error("Failed to clear cart: " + error?.response?.data?.message, {
          id: "cart",
        });
      else toast.error("Failed to clear cart.", { id: "cart" });
      console.error("Error clearing cart:" + error);
    }
  },
  getMyCoupon: async () => {
    try {
      const res = await axios.get("/coupons");
      set({ coupon: res.data.coupon });
    } catch (error) {
      set({ coupon: null });
    }
  },
  applyCoupon: async (couponCode: string) => {
    try {
      const res = await axios.post("/coupons/validate", { code: couponCode });
      set({ coupon: res.data, isCouponApplied: true });
      get().calculateTotal();
      toast.success("Coupon applied successfully", { id: "coupon" });
    } catch (error: AxiosError | any) {
      set({ coupon: null });
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message, { id: "coupon" });
      } else toast.error("Failed to apply coupon", { id: "coupon" });
    }
  },
  removeCoupon: async () => {
    set({ isCouponApplied: false });
    get().calculateTotal();
    toast.success("Coupon removed successfully", { id: "coupon" });
  },
}));

export default useCartStore;

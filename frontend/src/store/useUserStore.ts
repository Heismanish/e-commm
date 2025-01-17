import { create } from "zustand";
import { isAxiosError } from "axios";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

type UserType = {
  name: string;
  email: string;
  role: string;
  cartItems: string[];
  createdAt: string;
};

type UserSignupType = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type UserLoginType = {
  email: string;
  password: string;
};

type UserStore = {
  user: UserType | null;
  loading: boolean;
  checkingAuth: boolean;
  signup: ({
    name,
    email,
    password,
    confirmPassword,
  }: UserSignupType) => Promise<void>;
  login: ({ email, password }: UserLoginType) => Promise<void>;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
};

const useUserState = create<UserStore>()((set) => ({
  user: null,
  loading: false,
  checkingAuth: false,

  signup: async ({
    name,
    email,
    password,
    confirmPassword,
  }: UserSignupType): Promise<void> => {
    set({ loading: true });

    if (password !== confirmPassword) {
      set({ loading: false });
      toast.error("Password doesn't match");
      return;
    }

    try {
      const response = await axios.post("/auth/signup", {
        name,
        email,
        password,
      });
      set({ user: response.data.user, loading: false });
      toast.success("Signed up successfully!!");
      return;
    } catch (error: unknown) {
      set({ loading: false });
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "An error has occurred while signing up!!"
        );
      } else {
        toast.error("An unknown error occurred");
      }
      return;
    }
  },
  login: async ({ email, password }: UserLoginType): Promise<void> => {
    set({ loading: true });
    try {
      const res = await axios.post("/auth/login", { email, password });
      set({ user: res.data.user, loading: false });
      toast.success("Logged in successfully!!");
    } catch (error: unknown) {
      set({ loading: false });
      if (isAxiosError(error)) {
        toast.error(
          error?.response?.data?.message || "An error occure while logging in!!"
        );
      } else {
        toast.error("An unknown error occurred");
      }
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const res = await axios.get("/auth/profile");
      set({ user: res.data.user, checkingAuth: false });
    } catch (error) {
      set({ user: null, checkingAuth: false });
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to authenticate user."
        );
      } else {
        toast.error("An unknown error occurred during authentication.");
      }
    }
  },
  logout: async (): Promise<void> => {
    try {
      const res = await axios.post("/auth/logout");
      set({ user: null });
      return;
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to log out user.");
      } else {
        toast.error("An unknown error occurred during logging out.");
      }
    }
  },
}));

export default useUserState;

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
  refreshToken: () => Promise<void>;
};

const useUserState = create<UserStore>()((set, get) => ({
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
      toast.error("Password doesn't match", { id: "password-mismatch" });
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
            "An error has occurred while signing up!!",
          { id: "signup" }
        );
      } else {
        toast.error("An unknown error occurred", { id: "signup" });
      }
      return;
    }
  },
  login: async ({ email, password }: UserLoginType): Promise<void> => {
    set({ loading: true });
    try {
      const res = await axios.post("/auth/login", { email, password });
      set({ user: res?.data?.user!, loading: false });
      toast.success("Logged in successfully!!");
    } catch (error: unknown) {
      set({ loading: false });
      if (isAxiosError(error)) {
        toast.error(
          error?.response?.data?.message ||
            "An error occure while logging in!!",
          { id: "login" }
        );
      } else {
        console.log(error);
        toast.error("An unknown error occurred", { id: "login" });
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
  refreshToken: async () => {
    if (get().checkingAuth) return;
    set({ checkingAuth: true });
    try {
      const res = await axios.get("/auth/access-token");
      set({ checkingAuth: false });
      return res.data;
    } catch (error) {
      console.log(error);
      set({ checkingAuth: false, user: null });
      throw error;
    }
  },
}));

// AXIOS interceptor for token refresh:

let refreshPromise: Promise<void> | null = null;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        //  if a refresh is already in progress, wait for it to complete
        if (refreshPromise) {
          await refreshPromise;
        } else {
          refreshPromise = useUserState.getState().refreshToken();
          await refreshPromise;
          refreshPromise = null;
        }

        return axios(originalRequest);
      } catch (error) {
        // if refresh fails, logout
        useUserState.getState().logout();
        refreshPromise = null;
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default useUserState;

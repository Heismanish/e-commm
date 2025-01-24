import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/api"
      : "https://e-commm-production.up.railway.app/api",
  withCredentials: true,
});

export default axiosInstance;

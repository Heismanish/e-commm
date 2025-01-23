import { Navigate, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import useUserStore from "./store/useUserStore";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import Dashboard from "./pages/Dashboard";
import CategoryPage from "./pages/CategoryPage";
import Cart from "./pages/CartPage";
import useCartStore from "./store/useCartStore";

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const { cart, getCartItems } = useCartStore();

  useEffect(() => {
    getCartItems();
  }, [getCartItems]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {}, []);

  if (checkingAuth) return <LoadingSpinner />;
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]" />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-50 pt-20">
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route
            path="/signup"
            element={!user ? <SignupPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/secret-dashboard"
            element={
              user?.role === "admin" ? <Dashboard /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/category/:category"
            element={user ? <CategoryPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/cart"
            element={user ? <Cart /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
}

export default App;

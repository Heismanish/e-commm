import { Link } from "react-router-dom";
import { ShoppingCart, Lock, UserPlus, LogOut, LogInIcon } from "lucide-react";
import useUserState from "../store/useUserStore";
import useCartStore from "../store/useCartStore";
import { useEffect } from "react";

const Navbar = () => {
  const { user, logout } = useUserState();
  const { cart, getCartItems } = useCartStore();

  const isAdmin: boolean = user?.role === "admin";

  useEffect(() => {
    getCartItems();
  }, [getCartItems]);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-gray-900 backdrop-blur-lg bg-opacity-80 shadow-lg duration-300 transition-all border-b border-emerald-800 ">
      <div className="container mx-auto py-3 px-4">
        <div className="flex flex-wrap flex-row justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-semibold text-emerald-400 items-center flex space-x-2"
          >
            E-commerce
          </Link>

          <nav className="flex flex-row flex-wrap items-center gap-2">
            {user && (
              <Link
                to="/cart"
                className="relative group text-white hover:text-emerald-400 px-3 py-2 flex"
              >
                <ShoppingCart
                  className="ml-2 color-white hove:color-emerald-400 transition-all ease-in-out"
                  size={20}
                />
                <span className=" hidden sm:inline ml-2">Cart</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 left-0  px-2 py-1 text-xs font-bold leading-none text-gray-100  bg-emerald-500 rounded-full group-hover:bg-emerald-400 transition duration-300 ease-in-out">
                    {cart.length}
                  </span>
                )}
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/secret-dashboard"
                className=" px-3 py-2 text-white  bg-emerald-600  hover:bg-emerald-700 rounded-md font-medium transition duration-300 ease-in-out flex items-center justify-center"
              >
                <Lock className="inline-block mr-1" size={20} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}
            {user ? (
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-white bg-gray-700 hover:bg-gray-600 rounded-md flex items-center justify-center transition duration-300 ease-in-out"
              >
                <LogOut className="inline-block " size={20} />
              </button>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-2 rounded-md flex items-center justify-center transition duration-300 ease-in-out"
                >
                  <UserPlus className="inline-block mr-1" size={20} />
                  <span className="hidden sm:inline"> Signup</span>
                </Link>
                <Link
                  to="/login"
                  className="text-white bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md flex items-center justify-center transition duration-300 ease-in-out"
                >
                  <LogInIcon className="inline-block mr-1" size={20} />
                  <span className="hidden sm:inline"> Login</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

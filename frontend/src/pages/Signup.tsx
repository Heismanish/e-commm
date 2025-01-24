import { motion } from "framer-motion";
import { ArrowRight, Loader, Mail, User, UserPlus } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import useUserState from "../store/useUserStore";

const SignupPage = () => {
  const { signup, loading } = useUserState();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    signup(formData);
  };

  return (
    <div className="flex flex-col justify-center py-12 sm:px-8 xl:px-12">
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-3xl text-emerald-400 text-center font-extrabold mt-6">
          Create your account
        </h2>
      </motion.div>

      <motion.div
        className="mt-8 xs:mx-auto xs:w-full xs:max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="bg-gray-800 px-4 py-8 rounded-lg sm:px-10 shadow">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="text-gray-300 text-sm font-medium block"
              >
                Full Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="James Bond"
                  autoComplete="off"
                  className="block bg-gray-700 w-full py-2 px-2 pl-10 rounded-md shadow-sm border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-emerald-500 "
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="text-gray-300 text-sm font-medium block"
              >
                Email Address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="james007@gmail.com"
                  autoComplete="off"
                  className="block bg-gray-700 w-full py-2 px-2 pl-10 rounded-md shadow-sm border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-emerald-500 "
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="text-gray-300 text-sm font-medium block"
              >
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="********"
                  autoComplete="off"
                  className="block bg-gray-700 w-full py-2 px-2 pl-10 rounded-md shadow-sm border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-emerald-500 "
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="text-gray-300 text-sm font-medium block"
              >
                Confirm Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="confirm-password"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="********"
                  autoComplete="off"
                  className="block bg-gray-700 w-full py-2 px-2 pl-10 rounded-md shadow-sm border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-emerald-500 "
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:rind-emerald-500 transition duration-150 ease-in-out disabled:opacity-40"
            >
              {loading ? (
                <>
                  <Loader
                    className="mr-2 h-5 w-5 animate-spin"
                    aria-hidden="true"
                  />{" "}
                  Loading...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-5 w-5" aria-hidden="true" /> Sign
                  up
                </>
              )}
            </button>
            <div className="text-sm text-gray-400 text-center mt-8 ">
              Already have an account?{" "}
              <Link
                to={"/login"}
                className="inline font-semibold text-emerald-500 hover:text-emerald-300 transition-colors duration-150"
              >
                Login here
                <ArrowRight className="inline w-4 h-4 mr-2" />
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;

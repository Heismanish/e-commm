import { motion } from "framer-motion";
import { ArrowRight, Loader, LogIn, Mail, User } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import useUserState from "../store/useUserStore";

const LoginPage = () => {
  const { loading, login } = useUserState();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className="flex flex-col justify-center py-12 lg:px-8 sm:px-6">
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center  text-emerald-400">
          Log in to your account
        </h2>
      </motion.div>

      <motion.div
        className="mt-8 xs:mx-auto xs:w-full xs:max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="bg-gray-800 px-4 py-8 rounded-lg sm:px-10 shadow">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
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
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
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
                  <LogIn className="mr-2 h-5 w-5" aria-hidden="true" /> Login
                </>
              )}
            </button>
            <div className="text-sm text-gray-400 text-center mt-8 ">
              Not a member?{" "}
              <Link
                to={"/signup"}
                className="inline font-semibold text-emerald-500 hover:text-emerald-300 transition-colors duration-150"
              >
                Sign up now
                <ArrowRight className="inline w-4 h-4 mr-2" />
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { motion } from "framer-motion";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(formData.email, formData.password);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.42, 0, 0.58, 1],
      },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div
        className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Side */}
        <div className="flex flex-col justify-center p-8 md:p-14">
          <motion.span
            className="mb-3 text-4xl font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.2, duration: 0.5 },
            }}
          >
            Welcome back
          </motion.span>
          <motion.span
            className="font-light text-gray-400 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.3, duration: 0.5 },
            }}
          >
            Welcome back! Please enter your details.
          </motion.span>
          <form onSubmit={onSubmit}>
            {error && (
              <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg animate-shake">
                {error}
              </div>
            )}
            <motion.div
              className="py-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: { delay: 0.4, duration: 0.5 },
              }}
            >
              <span className="mb-2 text-md">Email</span>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 transition-shadow"
                name="email"
                value={formData.email}
                onChange={onChange}
                required
              />
            </motion.div>
            <motion.div
              className="py-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: { delay: 0.5, duration: 0.5 },
              }}
            >
              <span className="mb-2 text-md">Password</span>
              <input
                type="password"
                name="password"
                className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 transition-shadow"
                value={formData.password}
                onChange={onChange}
                required
              />
            </motion.div>
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white p-2 rounded-lg mb-6 disabled:bg-gray-400"
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: 0.6, duration: 0.5 },
              }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </motion.button>
          </form>
          <div className="text-center text-gray-400">
            Don't have an account?
            <Link
              to="/register"
              className="font-bold text-black ml-1 hover:underline"
            >
              Sign up for free
            </Link>
          </div>
        </div>
        {/* Right Side */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 20 }}
          animate={{
            opacity: 1,
            x: 0,
            transition: { delay: 0.2, duration: 0.7 },
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1521999690724-6f84a2a7a2is?q=80&w=1887&auto=format&fit=crop"
            alt="img"
            className="w-[400px] h-full hidden rounded-r-2xl md:block object-cover"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;

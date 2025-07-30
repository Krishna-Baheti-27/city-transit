import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { motion } from "framer-motion";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password2: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await register(formData.email, formData.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div
        className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Left Side */}
        <div className="flex flex-col justify-center p-8 md:p-14">
          <span className="mb-3 text-4xl font-bold">Create Account</span>
          <span className="font-light text-gray-400 mb-8">
            Let's get you started on your journey!
          </span>
          <form onSubmit={onSubmit}>
            {error && (
              <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg animate-shake">
                {error}
              </div>
            )}
            <div className="py-4">
              <span className="mb-2 text-md">Email</span>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 transition-shadow"
                name="email"
                value={formData.email}
                onChange={onChange}
                required
              />
            </div>
            <div className="py-4">
              <span className="mb-2 text-md">Password</span>
              <input
                type="password"
                name="password"
                className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 transition-shadow"
                minLength="6"
                value={formData.password}
                onChange={onChange}
                required
              />
            </div>
            <div className="py-4">
              <span className="mb-2 text-md">Confirm Password</span>
              <input
                type="password"
                name="password2"
                className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 transition-shadow"
                minLength="6"
                value={formData.password2}
                onChange={onChange}
                required
              />
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white p-2 rounded-lg mb-6 disabled:bg-gray-400"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </motion.button>
          </form>
          <div className="text-center text-gray-400">
            Already have an account?
            <Link
              to="/login"
              className="font-bold text-black ml-1 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
        {/* Right Side */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: { delay: 0.2, duration: 0.5 },
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1887&auto=format&fit=crop"
            alt="img"
            className="w-[400px] h-full hidden rounded-r-2xl md:block object-cover"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;

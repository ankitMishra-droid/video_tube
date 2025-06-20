import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../assets/loader.gif";
import { useDispatch } from "react-redux";
import { setUserDetails } from "@/features/authSlice";
import { Eye, EyeClosed } from "lucide-react";
import axiosFetch from "@/helpers/fetchData";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ email: "", password: "", general: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const togglePassword = () => setShowPassword(!showPassword);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError({ ...error, [name]: "", general: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({ email: "", password: "", general: "" });

    try {
      const response = await axiosFetch.post("/users/login", data);

      if (response?.data?.data) {
        const { user, accessToken, refreshToken } = response.data.data;

        // Save tokens
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        dispatch(setUserDetails(user));
        toast.success(response?.data?.message + " 🤩");

        // Optional: reset form
        setData({ email: "", password: "" });

        navigate("/");
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.meessage || // handle misspelled backend response
        error?.message ||
        "Something went wrong";

      setError((prev) => ({ ...prev, general: message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-4 flex justify-center items-center">
      <div className="w-full max-w-lg md:max-w-md sm:max-w-xs">
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="email"
              id="email"
              type="email"
              placeholder="Email"
              value={data.email}
              onChange={handleChange}
              required
            />
            {error.email && (
              <p className="text-red-500 text-xs italic">{error.email}</p>
            )}
          </div>

          <div className="mb-6 relative">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="******************"
              value={data.password}
              onChange={handleChange}
              required
            />
            <p
              onClick={togglePassword}
              className="absolute top-9 right-2 cursor-pointer"
            >
              {showPassword ? <EyeClosed /> : <Eye />}
            </p>
            {error.password && (
              <p className="text-red-500 text-xs italic">{error.password}</p>
            )}
          </div>

          <div className="flex flex-col items-center justify-center">
            <button
              className="bg-blue-600 hover:bg-blue-700 w-1/2 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-between">
                  <p>Signing in...</p>
                  <img src={Loader} alt="loading" className="w-6 h-6 ml-2" />
                </div>
              ) : (
                "Sign In"
              )}
            </button>

            {error.general && (
              <p className="text-red-500 text-xs italic mt-2">
                {error.general}
              </p>
            )}

            <p className="text-center text-blue-500 text-xs py-1 pt-2">
              Don't have an account?{" "}
              <Link to="/signup" className="text-red-500 hover:underline pl-1">
                Sign Up
              </Link>
            </p>

            <Link
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              to="/forgot-password"
            >
              Forgot Password?
            </Link>
          </div>
        </form>

        <p className="text-center text-gray-500 text-xs">
          &copy;2024 PlayPulse Ltd. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;

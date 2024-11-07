import fetchApi from "@/common";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignUp = () => {
  const [data, setData] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    avatar: "",
  });

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((preData) => {
      return {
        ...preData,
        [name]: value,
      };
    });
  };

  const handleUploadFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData((preData) => ({
        ...preData,
        avatar: file,
      }));
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("userName", data.userName);
    formData.append("email", data.email);
    formData.append("avatar", data.avatar);
    formData.append("password", data.password);

    const response = await fetch(fetchApi.signup.url, {
      method: fetchApi.signup.method,
      credentials: "include",
      body: formData,
    });

    const dataRes = await response.json();

    if (dataRes.success) {
      toast.success(dataRes.message);
      navigate("/login")
    } else {
      toast.error(dataRes.message || "something went wrong");
    }
  };

  return (
    <div>
      <div className="container mx-auto py-4 flex justify-center">
        <div className="w-full max-w-lg md:max-w-md sm:max-w-xs">
          <form
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="userName"
              >
                UserName
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="userName"
                id="userName"
                type="text"
                placeholder="Enter UserName"
                value={data.userName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="firstName"
              >
                First Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="firstName"
                id="firstName"
                type="text"
                placeholder="Enter First Name"
                value={data.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="lastName"
              >
                Last Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="lastName"
                id="lastName"
                type="lastName"
                placeholder="Enter lastName"
                value={data.lastName}
                onChange={handleChange}
                required
              />
            </div>
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
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="avatar"
              >
                Upload Profile
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="avatar"
                name="avatar"
                type="file"
                onChange={handleUploadFile}
                placeholder="******************"
                required
              />
              {/* <p className="text-red-500 text-xs italic">Please choose a password.</p> */}
            </div>
            <div className="mb-6">
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
                type="password"
                value={data.password}
                onChange={handleChange}
                placeholder="******************"
                required
              />
              {/* <p className="text-red-500 text-xs italic">Please choose a password.</p> */}
            </div>
            <div className="mb-6">
              <p className="text-center text-blue-500 text-xs">
                Already Have an Account?{" "}
                <Link
                  to={"/login"}
                  className="text-red-500 hover:underline pl-1"
                >
                  Login
                </Link>
              </p>
            </div>
            <div className="flex items-center justify-center">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Sign Up
              </button>
            </div>
          </form>
          <p className="text-center text-gray-500 text-xs">
            &copy;2024 PlayPulse ltd. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

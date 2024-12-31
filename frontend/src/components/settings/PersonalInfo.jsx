import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import fetchApi from "@/common";
import { setUserDetails } from "@/features/authSlice";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import axiosFetch from "@/helpers/fetchData";

const PersonalInfo = () => {
  const status = useSelector((state) => state.auth.status);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
  });

  const handleChangeData = (e) => {
    const { name, value } = e.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const updateData = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosFetch.patch(`/users/update-user`, data);

      if (response?.data?.data) {
        dispatch(setUserDetails(response.data.data));
        toast.success(response?.data?.message || "Updated");
      }else{
        toast.error(response?.data?.meessage || "something went wrong");
      }
    } catch (error) {
      toast.error("something went wrong");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (status) {
    return (
      <div>
        <div className="w-full flex flex-col md:flex-row gap-2">
          <div className="w-full md:w-1/3">
            <h2 className="text-lg sm:text-2xl font-semibold">Personal Info</h2>
            <p>Update your profile and photos.</p>
          </div>
          <div className="w-full md:w-2/3">
            <div className="border border-gray-600 rounded-md p-3">
              <form onSubmit={updateData}>
                <div>
                  <Label>Full Name</Label>
                  <div className="flex flex-col md:flex-row gap-2">
                    <Input
                      type="text"
                      name="firstName"
                      value={data.firstName}
                      onChange={handleChangeData}
                      placeholder="Enter first name"
                    />
                    <Input
                      type="text"
                      name="lastName"
                      value={data.lastName}
                      onChange={handleChangeData}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={handleChangeData}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="mt-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col justify-center items-center mt-10">
        <p>please login to access this page</p>
        <Link to={"/login"} className="text-blue-700 hover:text-blue-900 hover underline">Login</Link>
      </div>
    );
  }
};

export default PersonalInfo;

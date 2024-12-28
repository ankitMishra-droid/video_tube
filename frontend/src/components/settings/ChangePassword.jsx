import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import fetchApi from "@/common";

const ChangePassword = () => {
  const status = useSelector((state) => state.auth.status);
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      if(data.newPassword !== data.confirmPassword){
        toast.error("confirm password mismatch")
      }else{
        const response = await fetch(`${fetchApi.updatePassword.url}`, {
          method: fetchApi.updatePassword.method,
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });

        const dataRes = await response.json()
        if(dataRes?.data){
          toast.success(dataRes?.meessage || "Password Changed Successfully.")
          setData({
            oldPassword: "",
            newPassword: "",
            confirmPassword: ""
          })
        }else{
          toast.error(dataRes?.meessage || "something went wrong")
        }
      }
    } catch (error) {
      console.log(error)
      toast.error("something went wrong")
    }finally{
      setLoading(false)
    }
  };
  if (status) {
    return (
      <div>
        <div className="w-full flex flex-col md:flex-row gap-2">
          <div className="w-full md:w-1/3">
            <h2 className="text-lg sm:text-2xl font-semibold">
              Change Password
            </h2>
            {/* <p></p> */}
          </div>
          <div className="w-full md:w-2/3">
            <div className="border border-gray-600 rounded-md p-3">
              <form onSubmit={updatePassword}>
                <div>
                  <Label>Old Password</Label>
                  <Input
                    type="password"
                    name="oldPassword"
                    value={data.oldPassword}
                    onChange={handleChange}
                    placeholder="Enter old password"
                  />
                </div>
                <div>
                  <Label>New Password</Label>
                  <Input
                    type="password"
                    name="newPassword"
                    value={data.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <Label>Confirm Password</Label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    value={data.confirmPassword}
                    onChange={handleChange}
                    placeholder="Enter confirm password"
                  />
                </div>
                <div className="mt-2">
                  <Button type="submit" disabled={loading}>
                    Change Password
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
        <Link
          to={"/login"}
          className="text-blue-700 hover:text-blue-900 hover underline"
        >
          Login
        </Link>
      </div>
    );
  }
};

export default ChangePassword;

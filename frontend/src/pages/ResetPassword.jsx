import fetchApi from "@/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import loadingGif from "@/assets/loader.gif";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { userId, token } = useParams();
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        `${fetchApi.resetPassword.url}/${userId}/${token}`,
        {
          method: fetchApi.resetPassword.methood,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      const dataRes = await response.json();
      if (dataRes?.success) {
        toast.success("Password reset successfully");
        navigate("/login");
        setPassword("");
        setLoading(false);
      } else {
        toast.error(dataRes?.meessage);
      }
    } catch (error) {
      toast.error("something went wrong");
      console.log("error while reset password", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center mt-10">
      <form className="w-full md:w-1/2" onSubmit={handleResetPassword}>
        <div className="">
          <Label>Enter New Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className=""
            placeholder="Enter password"
          />
        </div>
        <div className="mt-5">
          {loading ? (
            <Button type="submit" disabled={true} className="px-9">
              <img
                src={loadingGif}
                className="w-6 h-6 block mx-auto"
                alt="loading_img"
              />
            </Button>
          ) : (
            <Button type="submit">Submit</Button>
          )}
        </div>
        <h5 className="text-red-600">
          Note*: this link is valid for only 10 minutes
        </h5>
      </form>
    </div>
  );
};

export default ResetPassword;

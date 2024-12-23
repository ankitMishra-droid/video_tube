import fetchApi from "@/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { toast } from "react-toastify";
import loadingGif from "@/assets/loader.gif";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${fetchApi.sendPasswordRestLink.url}`, {
        method: fetchApi.sendPasswordRestLink.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const dataRes = await response.json();
      console.log(dataRes)
      if (dataRes?.success) {
        toast.success("reset link sent to your registered email");
        setEmail("");
      }else{
        toast.error(dataRes?.meessage)
      }
    } catch (error) {
      console.log("error while sending forgot email link", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center mt-10">
      <form className="w-full md:w-1/2" onSubmit={handleSubmitEmail}>
        <div>
          <Label>Enter your registered email</Label>
          <Input
            type="email"
            placeholder="Enter your email"
            className="mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
      </form>
    </div>
  );
};

export default ForgotPassword;

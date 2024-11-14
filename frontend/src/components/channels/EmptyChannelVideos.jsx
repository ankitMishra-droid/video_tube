import { PlayCircle } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const EmptyChannelVideos = () => {
  const { status } = useSelector((state) => state?.auth);
  const userData = useSelector((state) => state?.auth?.user)
  const user = useSelector((state) => state?.user);
  const navigate = useNavigate();

    if(status && user.userName === userData.userName){
        return (
            <div className="flex justify-center p-4">
                <div className="w-full max-w-sm text-center mt-8">
                    <p className="mb-3 w-full">
                        <span className="inline-flex rounded-full">
                            <PlayCircle />
                        </span>
                    </p>
                    <h4>Videos uploaded</h4>
                    <p>You have yet to upload video. Click to new Upload a video</p>
                    <Button onClick={() => navigate("/admin/dashboard")}>
                        New Video
                    </Button>
                </div>
            </div>
        )
    }
};

export default EmptyChannelVideos;

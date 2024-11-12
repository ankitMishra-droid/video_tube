import { PlayCircle } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const EmptyChannelVideos = () => {
  const { status, userData } = useSelector((state) => state?.auth);
  const { user } = useSelector((state) => state?.user);
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
                </div>
            </div>
        )
    }
};

export default EmptyChannelVideos;

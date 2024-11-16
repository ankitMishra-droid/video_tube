import { FolderOpen, PlusIcon } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";

const ChannelEmptyPlayList = ({ videos = false }) => {
  const status = useSelector((state) => state?.auth?.status);
  const userData = useSelector((state) => state?.auth?.user);
  const user = useSelector((state) => state?.user?.user);

  if (status && user.userName === userData.userName) {
    return(
        <div className="flex justify-center p-2">
            <div className="w-full max-w-sm text-center mt-6">
                <div className="mb-3 w-full">
                    <span className="inline-flex rounded-full bg-gray-700 p-2">
                        <FolderOpen className="w-6 h-6 text-white"/>
                    </span>
                    <h3 className="mt-1 mb-2 font-semibold">
                        {videos ? "Empty Playlist" : "Playlist not created"}
                    </h3>
                    <p className="mb-2">
                        {
                            videos ?
                            "There is no video saved in playlist." :
                            "Create a playlist"
                        }
                    </p>
                    {
                        !videos && (
                            <Button onCLick={() => "/playlist"} className="inline-flex items-center bg-black">
                                <PlusIcon />
                                <span>New PlayList</span>
                            </Button>
                        )
                    }
                </div>
            </div>
        </div>
    );
  }
};

export default ChannelEmptyPlayList;

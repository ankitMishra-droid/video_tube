import { FolderOpen, PlusIcon } from "lucide-react";
import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";
import PlaylistForm from "../playlist/PlaylistForm";

const ChannelEmptyPlayList = ({ videos = false }) => {
    const status = useSelector((state) => state.auth.status);
    const userData = useSelector((state) => state.auth.user);
    const user = useSelector((state) => state.user.user);

    console.log("empty playlist1: ", user)
    console.log("empty playlist2: ", userData)

    const dialog = useRef();

    const playlistPopup = () => {
        if (dialog.current) {
            dialog.current.open();
        }
    };

    if ((status && user?.userName === userData?.userName)) {
        return (
            <div className="flex justify-center p-2">
                <div className="w-full max-w-sm text-center mt-6">
                    <div className="mb-3 w-full">
                        <span className="inline-flex rounded-full bg-gray-700 p-2">
                            <FolderOpen className="w-6 h-6 text-white" />
                        </span>
                        <h3 className="mt-1 mb-2 font-semibold">
                            {videos ? "Empty Playlist" : "Playlist not created"}
                        </h3>
                        <p className="mb-2">
                            {videos ? "There is no video saved in playlist." : "Create a playlist"}
                        </p>
                        <PlaylistForm ref={dialog} />
                        {!videos && (
                            <Button
                                onClick={playlistPopup}
                                className="inline-flex items-center bg-black"
                            >
                                <PlusIcon />
                                <span>New PlayList</span>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        );
    }else{
        return(
            <div className="flex justify-center mt-4">
                <div className="max-w-sm w-full text-center mt-6">
                    <p className="mb-3 w-full inline-flex">
                        <span><FolderOpen className="w-6 h-6"/></span>
                    </p>
                    <h5 className="mb-2 font-semibold">
                    {
                        videos ? "Empty Playlist" : "No playlist created"
                    }
                </h5>
                <p className="">
                    {
                        videos ? "This playlist has no videos" : "there are no playlist created on this channel"
                    }
                </p>
                </div>
            </div>
        )
    }
};

export default ChannelEmptyPlayList;

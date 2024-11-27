import fetchApi from "@/common";
import { updatePlaylists } from "@/features/playlistSlice";
import getUserPlayList from "@/fetchDetails/getUserPlaylist";
import { Cross, CrossIcon, X } from "lucide-react";
import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PlaylistForm = ({ playlist, route }, ref) => {
  const userId = useSelector((state) => state?.user?.user?._id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dialog = useRef();

  const [data, setData] = useState({
    content: playlist?.content || "",
    description: playlist?.description || "",
  });
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  useImperativeHandle(
    ref,
    () => ({
      open() {
        setShowPopup(true);
      },
      close() {
        handleClose();
      },
    }),
    []
  );

  useEffect(() => {
    if (showPopup) {
      dialog.current.showModal();
    }
  }, [showPopup]);

  const handleClose = () => {
    dialog.current.close();
    setShowPopup(false);
    if (route) navigate(route);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdatePlaylist = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = playlist
        ? `${fetchApi.getUserPlayList.url}/${playlist._id}`
        : fetchApi.getUserPlayList.url;

      const method = playlist ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const dataRes = await response.json();

      if (dataRes?.data) {
        if (playlist) {
          dispatch(
            updatePlaylists({
              content: dataRes.data.content,
              description: dataRes.data.description,
            })
          );
        } else {
          getUserPlayList(dispatch, userId);
        }
        toast.success(dataRes?.message || "Playlist updated successfully");
      }

      handleClose();
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute rounded-md">
      {showPopup &&
        createPortal(
          <dialog
            ref={dialog}
            className="playlist-dialog rounded-md sm:w-2/4 lg:w-1/3 w-full"
            onClose={handleClose}
          >
            <div className="relative">
              <form onSubmit={handleUpdatePlaylist} className="py-4 px-3">
                <div className="absolute top-3 right-3">
                <button onClick={handleClose} className="px-3 py-1 transition-all">
                  <X />
                </button>
                </div>
                <div className="my-3 flex flex-col justify-center">
                  <label className="">Name</label>
                  <input
                    type="text"
                    placeholder="Enter playlist name"
                    value={data.content}
                    name="content"
                    onChange={handleChange}
                    className="p-2 border-2 border-slate-700 rounded-sm focus:outline-slate-900"
                  />
                </div>
                <div className="my-3 flex flex-col justify-center">
                  <label className="">Description</label>
                  <textarea
                    placeholder="Enter playlist description"
                    value={data.description}
                    name="description"
                    onChange={handleChange}
                    className="p-2 border-2 border-slate-700 rounded-sm focus:outline-slate-900"
                  />
                </div>
                <div className="mx-2 my-3 flex justify-end">
                <button type="submit" disabled={loading} className="text-end bg-slate-700 px-3 py-1 rounded-md text-white hover:bg-slate-900 transition-all">
                  {loading ? "Updating..." : "Update"}
                </button>
                </div>
              </form>
            </div>
          </dialog>,
          document.body
        )}
    </div>
  );
};

export default React.forwardRef(PlaylistForm);

import React, { useState } from "react";
import VideocardDash from "./VideocardDash";
import { ArrowDown, ArrowUp } from "lucide-react";

const VideoPanel = ({ channelVideos }) => {
  const [filter, setFilter] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const [showDropdown, setShowDropdown] = useState(false);

  function handleSearch(input) {
    if (!input || input === "") {
      setFilter(channelVideos);
    }

    const filteredVideo = channelVideos?.filter((video) =>
      video?.title?.toLowerCase().startsWith(input.toLowerCase().trim())
    );
    setFilter(filteredVideo);
  }

  const handleSortOrderChange = (event) => {
    const newSortOrder = event.target.value;
    setSortOrder(newSortOrder);

    const sortedVideos = [...(filter || channelVideos)].sort((a, b) => {
      if (newSortOrder === "desc") {
        return b.views - a.views;
      } else {
        return a.views - b.views;
      }
    });

    setFilter(sortedVideos);

    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  let videos = filter || channelVideos;

  if(videos?.length === 0){
    return(
      <div className="flex justify-center mt-10">
        <p>there is no video uploaded yet.</p>
      </div>
    )
  }

  return (
    <div>
      {/* search video */}
      <div className=""></div>
      {/* search video */}

      {/* videos */}
      <div className="w-full overflow-auto border mt-5 rounded-md">
        <table className="w-full min-w-[1000px] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="border-collapse border-b p-4 text-center">
                Toggle
              </th>
              <th className="border-collapse border-b p-4 text-center">
                Status
              </th>
              <th className="border-collapse border-b p-4 text-center">
                Video
              </th>
              <th className="border-collapse border-b p-4 text-center">
                Video Uploaded
              </th>
              <th className="border-collapse border-b p-4 text-center">
                <div
                  className={`relative flex items-center gap-x-2 justify-center cursor-pointer`}
                >
                  Views{" "}
                  {showDropdown ? (
                    sortOrder === "desc" ? (
                      <ArrowUp className="w-5 h-5" />
                    ) : (
                      <ArrowDown className="w-5 h-5" />
                    )
                  ) : (
                    <button className="w-5 h-5" onClick={toggleDropdown}>
                      {sortOrder === "desc" ? (
                        <ArrowUp className="w-5 h-5" />
                      ) : (
                        <ArrowDown className="w-5 h-5" />
                      )}
                    </button>
                  )}
                </div>

                {showDropdown && (
                  <div className="absolute mt-2 bg-white border rounded-md shadow-md p-2 z-10">
                    <select
                      value={sortOrder}
                      onChange={handleSortOrderChange}
                      className="p-2 border rounded"
                    >
                      <option value="desc">Most Viewed</option>
                      <option value="asc">Least Viewed</option>
                    </select>
                  </div>
                )}
              </th>
              <th className="border-collapse border-b p-4 text-center">
                Comments
              </th>
              <th className="border-collapse border-b p-4 text-center">
                Likes
              </th>
              <th className="border-collapse border-b p-4 text-center">
                Options
              </th>
            </tr>
          </thead>
          <tbody className="p-4">
            {videos?.map((video) => (
              <VideocardDash key={video?._id} video={video} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VideoPanel;

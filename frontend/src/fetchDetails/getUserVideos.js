import fetchApi from "@/common";
import { addUserVideos } from "@/features/userSlice";

const getUserVideo = async (
  dispatch,
  userId,
  sortType,
  page = 1,
  limit = 10
) => {
  // Construct query parameters properly
  const params = new URLSearchParams({
    sortType: sortType,
    page: page.toString(),
    limit: limit.toString(),
  }).toString();

  try {
    const response = await fetch(`${fetchApi.getUserVideo.url}/${userId}?${params}`, {
      method: fetchApi.getUserVideo.method,
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const dataRes = await response.json();
    
    if (dataRes?.data) {
      dispatch(addUserVideos(dataRes?.data));
      return dataRes.data;
    }
  } catch (error) {
    console.error("Error fetching user videos:", error);
  }
};

export { getUserVideo };

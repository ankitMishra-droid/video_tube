import fetchApi from "@/common";
import { addUserVideos } from "@/features/userSlice";
import axiosFetch from "@/helpers/fetchData";

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
    const response = await axiosFetch.get(`/video/c/${userId}?${params}`);

    // if (!response?.data.ok) {
    //   throw new Error(`Error: ${response.status}`);
    // }

    if (response?.data?.data) {
      dispatch(addUserVideos(response?.data?.data));
      return response.data.data;
    }
  } catch (error) {
    console.error("Error fetching user videos:", error);
  }
};

export { getUserVideo };

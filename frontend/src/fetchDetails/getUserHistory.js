import { addUserHistory } from "@/features/userSlice";
import axiosFetch from "@/helpers/fetchData";

const fetchHistory = async (dispatch) => {
  try {
    const response = await axiosFetch.get(`/users/watch-history`);

    if (response?.data?.data) {
      dispatch(addUserHistory(response.data.data));
      return response.data.data;
    }
  } catch (error) {
    console.log(`error while fetching history: ${error}`);
  }
};

export { fetchHistory };

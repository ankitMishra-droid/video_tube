import fetchApi from "@/common";
import { addUserHistory } from "@/features/userSlice";

const fetchHistory = async (dispatch) => {
  try {
    const response = await fetch(`${fetchApi.watchHistory.url}`, {
      method: fetchApi.watchHistory.method,
      credentials: "include",
      headers: {
        "Contetn-type": "application/josn"
      }
    });

    const dataRes = await response.json();

    console.log(dataRes?.data);

    if (dataRes?.data) {
      dispatch(addUserHistory(dataRes.data));
      return dataRes.data;
    }
  } catch (error) {
    console.log(`error while fetching history: ${error}`);
  }
};

export { fetchHistory };

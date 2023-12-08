import { catchError, getToken } from "../utils/helper";
import client from "./client";

export const getAppInfo = async () => {
  const token = getToken();

  try {
    const { data } = await client(`/app/app-info`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const getMostRatedMovies = async () => {
  const token = getToken();

  try {
    const { data } = await client(`/app/most-rated`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    return data;
  } catch (error) {
    return catchError(error);
  }
};

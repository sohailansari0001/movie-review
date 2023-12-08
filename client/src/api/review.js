import client from "./client";
import { catchError, getToken } from "../utils/helper";

export const addReview = async (movieId, reviewData) => {
  const token = getToken();
  try {
    const { data } = await client.post(`/review/add/${movieId}`, reviewData, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    return data;
  } catch (error) {
    return catchError(error);
  }
};
export const getReviewByMovie = async (movieId) => {
  try {
    const { data } = await client(`/review/get-reviews-by-movie/${movieId}`);

    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const deleteReview = async (reviewId) => {
  const token = getToken();
  try {
    const { data } = await client.delete(`/review/${reviewId}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const updateReview = async (reviewId, reviewData) => {
  const token = getToken();
  try {
    const { data } = await client.patch(`/review/${reviewId}`, reviewData, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    return data;
  } catch (error) {
    return catchError(error);
  }
};

import { catchError, getToken } from "../utils/helper";
import client from "./client";

// api fetching for admin
export const uploadTrailer = async (formData, onUploadProgress) => {
  const token = getToken();
  try {
    const { data } = await client.post("/movie/upload-trailer", formData, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: ({ loaded, total }) => {
        if (onUploadProgress)
          onUploadProgress(Math.floor((loaded / total) * 100));
      },
    });

    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const uploadMovie = async (formData) => {
  const token = getToken();
  try {
    const { data } = await client.post("/movie/create", formData, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const geMovieForUpdate = async (id) => {
  const token = getToken();
  try {
    const { data } = await client(`/movie/for-update/${id}`, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const updateMovie = async (id, formData) => {
  const token = getToken();
  try {
    const { data } = await client.patch(`/movie/update/${id}`, formData, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const getMovies = async (pageNo, limit) => {
  const token = getToken();
  try {
    const { data } = await client(
      `/movie/movies?pageNo=${pageNo}&limit=${limit}`,
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const deleteMovie = async (id) => {
  const token = getToken();
  try {
    const { data } = await client.delete(`/movie/${id}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const searchMovieForAdmin = async (title) => {
  const token = getToken();
  try {
    const { data } = await client(`/movie/search?title=${title}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    return data;
  } catch (error) {
    return catchError(error);
  }
};

// api fetching for normal users

export const getTopRatedMovies = async (type) => {
  try {
    let endpoint = `/movie/top-rated`;
    if (type) {
      endpoint = endpoint + `?type=${type}`;
    }

    const { data } = await client(endpoint);
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const getLatestUploads = async () => {
  try {
    const { data } = await client(`/movie/latest-uploads`);
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const getSingleMovie = async (id) => {
  try {
    const { data } = await client(`/movie/single/${id}`);
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const getRelatedMovies = async (id) => {
  try {
    const { data } = await client(`/movie/related/${id}`);
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const searchPublicMovie = async (title) => {
  try {
    const { data } = await client(`/movie/search-public?title=${title}`);
    return data;
  } catch (error) {
    return catchError(error);
  }
};

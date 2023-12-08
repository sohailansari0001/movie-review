import { createContext, useState } from "react";
import { getMovies } from "../api/movie";
import toast from "react-hot-toast";

export const MovieContext = createContext();
let currentPageNo = 0;
const limit = 6;

const MoviesProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [latestUploads, setLatestUploads] = useState([]);
  const [reachedToEnd, setReachedToEnd] = useState(false);

  const fetchLatestUploads = async (qty = 5) => {
    const { success, message, movies } = await getMovies(0, qty);

    if (!success) {
      return toast.error(message);
    }

    setLatestUploads([...movies]);
  };

  const fetchMovies = async (pageNo = currentPageNo) => {
    const {
      success,
      message,
      movies: resMovies,
    } = await getMovies(pageNo, limit);

    if (!success) {
      return toast.error(message);
    }

    if (!resMovies.length) {
      // setCurrentPageNo(pageNo - 1);
      currentPageNo = pageNo - 1;
      return setReachedToEnd(true);
    }

    setMovies([...resMovies]);
  };

  const fetchNextPage = () => {
    if (reachedToEnd) {
      toast.error("No More Movies!");
      return;
    }

    // setCurrentPageNo((prev) => prev + 1);
    currentPageNo += 1;
    fetchMovies(currentPageNo);
  };

  const fetchPrevPage = () => {
    if (currentPageNo <= 0) {
      currentPageNo = 0;
      setReachedToEnd(false);
      toast.error("You are on first page!");
      return;
    }
    setReachedToEnd(false);
    currentPageNo -= 1;

    fetchMovies(currentPageNo);
  };

  return (
    <MovieContext.Provider
      value={{
        movies,
        fetchMovies,
        fetchNextPage,
        fetchPrevPage,
        latestUploads,
        fetchLatestUploads,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export default MoviesProvider;

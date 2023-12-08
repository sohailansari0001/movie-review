import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MovieList } from "../";
import { getTopRatedMovies } from "../../api/movie";

const TopRatedMovies = () => {
  const [movies, setMovies] = useState([]);

  const fetchMovies = async () => {
    const { success, message, topRatedMovies } = await getTopRatedMovies();

    if (!success) {
      return toast.error(message);
    }

    setMovies([...topRatedMovies]);
  };

  useEffect(() => {
    fetchMovies();
    return () => {};
  }, []);

  return (
    <MovieList movies={movies} title={"Viewers Choice (Movies)"} className="" />
  );
};

export default TopRatedMovies;

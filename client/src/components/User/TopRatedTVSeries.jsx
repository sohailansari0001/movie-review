import { useEffect, useState } from "react";
import { getTopRatedMovies } from "../../api/movie";
import toast from "react-hot-toast";
import { MovieList } from "../";

const TopRatedTVSeries = () => {
  const [movies, setMovies] = useState([]);

  const fetchMovies = async () => {
    const { success, message, topRatedMovies } = await getTopRatedMovies(
      "TV Series"
    );

    if (!success) {
      return toast.error(message);
    }

    setMovies([...topRatedMovies]);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return <MovieList movies={movies} title={"Viewers Choice (TV Series)"} />;
};

export default TopRatedTVSeries;

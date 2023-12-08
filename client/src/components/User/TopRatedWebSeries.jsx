import { useEffect, useState } from "react";
import { MovieList } from "../";
import { getTopRatedMovies } from "../../api/movie";
import toast from "react-hot-toast";

const TopRatedWebSeries = () => {
  const [movies, setMovies] = useState([]);

  const fetchMovies = async () => {
    const { success, message, topRatedMovies } = await getTopRatedMovies(
      "Web Series"
    );

    if (!success) {
      return toast.error(message);
    }

    setMovies([...topRatedMovies]);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return <MovieList movies={movies} title={"Viewers Choice (Web Series)"} />;
};

export default TopRatedWebSeries;

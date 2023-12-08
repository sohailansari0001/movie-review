import { useEffect, useState } from "react";
import { getRelatedMovies } from "../../api/movie";
import toast from "react-hot-toast";
import MovieList from "./MovieList";

const RelatedMovies = ({ movieId }) => {
  const [movies, setMovies] = useState([]);

  const fetchRelatedMovies = async () => {
    const { success, message, relatedMovies } = await getRelatedMovies(movieId);

    if (!success) {
      return toast.error(message);
    }
    setMovies(relatedMovies);
  };

  useEffect(() => {
    if (movieId) {
      fetchRelatedMovies();
    }
  }, [movieId]);

  return (
    <MovieList
      title={"Related Movies/Series:"}
      movies={movies}
      className="text-left text-light-subtle dark:text-dark-subtle "
    />
  );
};

export default RelatedMovies;

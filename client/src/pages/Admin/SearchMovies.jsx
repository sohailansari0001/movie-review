import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import { searchMovieForAdmin } from "../../api/movie";
import { MovieListItem, NotFoundText } from "../../components";

const SearchMovies = () => {
  const [searchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [resultNotFound, setResultNotFound] = useState(false);

  const query = searchParams.get("title");

  const searchMovies = async (val) => {
    const { success, message, results } = await searchMovieForAdmin(val);

    if (!success) {
      return toast.error(message);
    }

    if (!results.length) {
      setResultNotFound(true);
      return setMovies([]);
    }
    setResultNotFound(false);
    setMovies([...results]);
  };

  const handleAfterDelete = (movie) => {
    const updatedMovie = movies.filter((m) => m.id !== movie.id);

    setMovies([...updatedMovie]);
  };

  const handleAfterUpdate = (movie) => {
    const updatedMovie = movies.map((m) => {
      if (m.id === movie.id) return movie;
      return m;
    });

    setMovies([...updatedMovie]);
  };

  useEffect(() => {
    if (query.trim()) {
      searchMovies(query);
    }
  }, [query]);

  return (
    <div className="p-5 space-y-4 mt-8">
      <NotFoundText text={"Record not found!"} visible={resultNotFound} />
      {!resultNotFound &&
        movies.map((movie) => {
          return (
            <MovieListItem
              movie={movie}
              key={movie.id}
              afterDelete={handleAfterDelete}
              afterUpdate={handleAfterUpdate}
            />
          );
        })}
    </div>
  );
};

export default SearchMovies;

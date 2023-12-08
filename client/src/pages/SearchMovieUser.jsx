import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  Container,
  MovieList,
  MovieListItem,
  NotFoundText,
} from "../components";
import { searchPublicMovie } from "../api/movie";

const SearchMovieUser = () => {
  const [searchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);

  const [resultNotFound, setResultNotFound] = useState(false);

  const query = searchParams.get("title");
  console.log(query);

  const searchMovies = async (val) => {
    const { success, message, results } = await searchPublicMovie(val);
    console.log(success, message, results);

    if (!success) {
      return toast.error(message);
    }

    if (!results?.length) {
      setResultNotFound(true);
      return setMovies([]);
    }
    setResultNotFound(false);
    setMovies([...results]);
  };

  useEffect(() => {
    if (query.trim()) {
      searchMovies(query);
    }
  }, [query]);

  return (
    <div className="dark:bg-primary bg-white min-h-screen py-[100px]">
      <Container>
        <NotFoundText text={"Record not found!"} visible={resultNotFound} />
        <MovieList movies={movies} />
      </Container>
    </div>
  );
};

export default SearchMovieUser;

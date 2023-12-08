import { useEffect } from "react";

// components
import { MovieListItem, NextAndPrevButton } from "../../components";

import { useMovies } from "../../hooks";

let currentPageNo = 0;

const Movies = () => {
  // hook

  const {
    fetchMovies,
    movies: newMovies,
    fetchNextPage,
    fetchPrevPage,
  } = useMovies();

  const handleUIUpdate = () => {
    fetchMovies();
  };

  useEffect(() => {
    fetchMovies(currentPageNo);
  }, []);

  return (
    <>
      <div className=" space-y-5 p-5">
        {newMovies.map((movie) => {
          return (
            <MovieListItem
              key={movie.id}
              movie={movie}
              afterDelete={handleUIUpdate}
              afterUpdate={handleUIUpdate}
            />
          );
        })}

        <NextAndPrevButton
          onNextClick={fetchNextPage}
          onPrevClick={fetchPrevPage}
        />
      </div>
    </>
  );
};

export default Movies;

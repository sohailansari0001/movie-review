import { useEffect } from "react";

// components
import { MovieListItem } from "../";
import { useMovies } from "../../hooks";

const LatestUploads = () => {
  // hook
  const { fetchLatestUploads, latestUploads } = useMovies();

  const handleUIUpdate = () => {
    fetchLatestUploads();
  };

  useEffect(() => {
    fetchLatestUploads();
  }, []);

  return (
    <>
      <div className=" bg-white dark:shadow dark:bg-secondary shadow p-5 rounded col-span-2">
        <h2 className=" mb-2 text-2xl font-semibold text-primary dark:text-white ">
          Recent Uploads
        </h2>

        <div className=" space-y-3">
          {latestUploads.map((movie) => (
            <MovieListItem
              key={movie.id}
              movie={movie}
              afterDelete={handleUIUpdate}
              afterUpdate={handleUIUpdate}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default LatestUploads;

import { useEffect, useState } from "react";
import { getMostRatedMovies } from "../api/admin";
import toast from "react-hot-toast";
import { RatingStar } from "./";
import { convertReviewCount } from "../utils/helper";
import { Link } from "react-router-dom";

const MostRatedMovies = () => {
  const [movies, setMovies] = useState([]);

  const fetchMostRatedMovies = async () => {
    const { success, message, topRatedMovies } = await getMostRatedMovies();

    if (!success) {
      return toast.error(message);
    }

    setMovies([...topRatedMovies]);
  };

  useEffect(() => {
    fetchMostRatedMovies();
  }, []);

  return (
    <div className=" bg-white dark:shadow dark:bg-secondary shadow p-5 rounded ">
      <h2 className=" mb-2 text-2xl font-semibold text-primary dark:text-white ">
        Top Rated
      </h2>
      <ul className="space-y-4 ">
        {movies.map((movie) => {
          return (
            <li key={movie.id}>
              <div className=" flex justify-between items-center">
                <Link
                  className=" text-secondary dark:text-white font-semibold hover:underline"
                  to={`/movie/${movie.id}`}
                >
                  {movie.title}
                </Link>
                <RatingStar rating={movie.reviews?.ratingAvg} />
              </div>
              <div className="flex items-center justify-between">
                <p className=" text-light-subtle dark:text-dark-subtle">
                  {convertReviewCount(movie.reviews?.reviewCount) || 0} Reviews
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MostRatedMovies;

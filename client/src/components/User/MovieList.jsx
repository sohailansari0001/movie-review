import { GridContainer, RatingStar } from "../";
import { getPoster, trimTitle } from "../../utils/helper";
import { Link } from "react-router-dom";

const MovieList = ({ movies = [], title, className = "" }) => {
  const classes = className
    ? className
    : "text-center dark:text-white text-secondary";

  if (!movies.length) {
    return null;
  }

  return (
    <div className=" pb-4">
      {title && (
        <h2 className={`text-2xl my-5 font-semibold ${classes}`}>{title}</h2>
      )}
      <GridContainer>
        {movies.map((movie) => {
          return <ListItem key={movie.id} movie={movie} />;
        })}
      </GridContainer>
    </div>
  );
};

const ListItem = ({ movie }) => {
  const { title, reviews, id, poster, reponsiviePosters } = movie;
  return (
    <Link to={`/movie/${id}`}>
      <div className="aspect-video overflow-hidden w-full">
        <img
          src={getPoster(reponsiviePosters) || poster}
          alt={title}
          className="w-full h-full object-cover hover-image"
        />
      </div>
      <h2
        className=" text-lg dark:text-white text-secondary font-semibold mt-2 ml-3"
        title={title}
      >
        {trimTitle(title)}
      </h2>
      <RatingStar rating={reviews?.ratingAvg} />
    </Link>
  );
};

export default MovieList;

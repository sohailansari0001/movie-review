import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  AddRatingModal,
  Container,
  CustomBtnLink,
  RatingStar,
  RelatedMovies,
} from "../components";

import { getSingleMovie } from "../api/movie";
import { convertDate, convertReviewCount } from "../utils/helper";
import { useAuth } from "../hooks";
import ProfileModal from "../components/Modals/ProfileModal";

const SingleMovie = () => {
  const [movie, setMovie] = useState({});
  const [ready, setReady] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfle, setSelectedProfle] = useState({});

  const { movieId } = useParams();
  const navigate = useNavigate();

  const { authInfo } = useAuth();

  const { isLoggedIn } = authInfo;

  const fetchMovie = async () => {
    const { success, messgae, movie } = await getSingleMovie(movieId);

    if (!success) {
      return toast.error(messgae);
    }
    setReady(true);
    setMovie({ ...movie });
  };

  const handleOnRateMovie = () => {
    if (!isLoggedIn) {
      toast.error("You are not logged in!");
      return navigate("/auth/sign-in");
    }

    setShowRatingModal(true);
  };

  const hideRatingModal = () => {
    setShowRatingModal(false);
  };

  const handleOnRatingSuccess = (reviews) => {
    setMovie({ ...movie, reviews: { ...reviews } });
  };

  const hideProfileModal = () => {
    // setSelectedProfle({});
    setShowProfileModal(false);
  };

  const handleProfileClick = (profile) => {
    setSelectedProfle(profile);
    setShowProfileModal(true);
  };

  useEffect(() => {
    if (movieId) {
      fetchMovie();
    }
  }, [movieId]);

  if (!ready) {
    return (
      <div className="  h-screen flex justify-center items-center dark:bg-primary bg-white">
        <p className=" text-light-subtle dark:text-dark-subtle animate-pulse text-2xl">
          Please Wait...
        </p>
      </div>
    );
  }

  const {
    trailer,
    poster,
    title,
    id,
    reviews = {},
    storyline,
    director = {},
    writers = [],
    cast = [],
    language,
    releaseDate,
    genres = [],
    type,
  } = movie;

  return (
    <div className="dark:bg-primary bg-white min-h-screen py-10 px-4  ">
      <Container className={" xl:px-0 px-4 pt-10 "}>
        {/* trailer */}
        <video poster={poster} controls src={trailer} className=" w-full" />

        {/* title  */}
        <div className=" flex justify-between items-center">
          <h2 className=" xl:text-4xl lg:text-3xl text-2xl text-highlight dark:text-highlight-dark py-3">
            {title}
          </h2>
          <div className=" flex gap-2 flex-col items-end">
            <RatingStar rating={reviews?.ratingAvg} />

            <CustomBtnLink
              label={`${convertReviewCount(reviews?.reviewCount)} Reviews`}
              onClick={() => navigate(`/movie/reviews/${id}`)}
            />
            <CustomBtnLink
              onClick={handleOnRateMovie}
              label={"Rate The Movie"}
              className={"self-end"}
            />
          </div>
        </div>

        <div className=" space-y-3">
          {/* storyline  */}
          <p className=" text-light-subtle dark:text-dark-subtle sm:text-lg text-base">
            {storyline}
          </p>
          {/* director */}
          <ListWithLabel label={"Director:"}>
            <CustomBtnLink
              label={director?.name}
              onClick={() => handleProfileClick(director)}
            />
          </ListWithLabel>

          {/* writer */}
          <ListWithLabel label={" Writers:"}>
            <div className="flex flex-wrap gap-2">
              {writers.map((w, i) => (
                <CustomBtnLink label={w?.name} key={i} />
              ))}
            </div>
          </ListWithLabel>

          {/* cast */}
          <ListWithLabel label={" Cast:"}>
            <div className="flex flex-wrap gap-2">
              {cast.map(
                (c, i) =>
                  c.leadActor && (
                    <CustomBtnLink label={c.profile.name} key={i} />
                  )
              )}
            </div>
          </ListWithLabel>

          {/* language */}
          <ListWithLabel label={"Language:"}>
            <CustomBtnLink label={language} clickable={false} />
          </ListWithLabel>

          {/* release date */}
          <ListWithLabel label={"Release Date:"}>
            <CustomBtnLink label={convertDate(releaseDate)} clickable={false} />
          </ListWithLabel>

          {/* genres */}
          <ListWithLabel label={"Genres:"}>
            <div className="flex gap-2 flex-wrap">
              {genres.map((g, i) => (
                <CustomBtnLink label={g} key={i} clickable={false} />
              ))}
            </div>
          </ListWithLabel>

          {/* type */}
          <ListWithLabel label={"Type:"}>
            <CustomBtnLink label={type} clickable={false} />
          </ListWithLabel>
        </div>

        {/* all members */}
        <CastProfiles cast={cast} />

        {/* related movies */}
        <RelatedMovies movieId={id} />
      </Container>

      <ProfileModal
        visible={showProfileModal}
        onClose={hideProfileModal}
        profileId={selectedProfle.id}
      />
      <AddRatingModal
        visible={showRatingModal}
        onClose={hideRatingModal}
        onSuccess={handleOnRatingSuccess}
      />
    </div>
  );
};

const ListWithLabel = ({ children, label }) => {
  return (
    <div className=" flex gap-2 sm:text-lg text-base">
      <p className="text-light-subtle dark:text-dark-subtle font-semibold">
        {label}
      </p>
      {children}
    </div>
  );
};

const CastProfiles = ({ cast }) => {
  return (
    <div className="mt-5">
      <h2 className="text-light-subtle dark:text-dark-subtle font-semibold mb-2  md:text-2xl sm:text-xl">
        Cast & Crew:
      </h2>
      <div className=" flex items-center flex-wrap  gap-8 ">
        {cast.map((c, i) => {
          return (
            <div key={i} className="basis-28 flex flex-col items-center mb-4">
              <div className=" aspect-square w-24 h-24 rounded-full overflow-hidden ">
                <img
                  src={c.profile?.avatar}
                  alt=""
                  className="w-full h-full rounded-full object-cover mb-2 hover-image"
                />
              </div>
              {/* name and role of actors */}
              <div className="text-center flex flex-col">
                <CustomBtnLink label={c.profile.name} />
                <span className=" text-light-subtle dark:text-dark-subtle">
                  as
                </span>
                <CustomBtnLink label={c.roleAs} clickable={false} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SingleMovie;

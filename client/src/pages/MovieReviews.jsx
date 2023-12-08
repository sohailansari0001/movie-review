import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BsTrash, BsPencilSquare } from "react-icons/bs";

import toast from "react-hot-toast";

import { deleteReview, getReviewByMovie } from "../api/review";

import {
  ConfirmModal,
  Container,
  CustomBtnLink,
  EditRatingModal,
  NotFoundText,
  RatingStar,
} from "../components";
import { useAuth } from "../hooks";

const getNameInitial = (name = "") => {
  return name[0].toUpperCase();
};

const MovieReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [profileOwnersReview, setProfileOwnersReview] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [movieTitle, setMovieTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState({});

  const { movieId } = useParams();

  const { authInfo } = useAuth();
  const profileId = authInfo.profile?.id;

  const fetchMovieReviews = async () => {
    const { success, message, movie } = await getReviewByMovie(movieId);

    if (!success) {
      return toast.error(message);
    }

    setReviews([...movie.reviews]);
    setMovieTitle(movie.title);
  };

  const findProfileOwnersReview = () => {
    if (profileOwnersReview) {
      return setProfileOwnersReview(null);
    }

    const matched = reviews.find((review) => review.owner.id === profileId);

    if (!matched) {
      return toast.error("You don't have any review!");
    }
    setProfileOwnersReview(matched);
  };

  const hideConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const displayConfirmModal = () => {
    setShowConfirmModal(true);
  };

  const handleDeleteConfirm = async () => {
    setBusy(true);
    const { success, message } = await deleteReview(profileOwnersReview.id);

    setBusy(false);
    if (!success) {
      return toast.error(message);
    }

    toast.success(message);

    const updatedReviews = reviews.filter(
      (r) => r.id !== profileOwnersReview.id
    );

    setReviews([...updatedReviews]);
    setProfileOwnersReview(null);
    hideConfirmModal();
  };

  const handleOnEditClick = async () => {
    const { id, content, rating } = profileOwnersReview;
    setSelectedReview({
      id,
      content,
      rating,
    });

    setShowEditModal(true);
  };

  const handleOnReviewUpdate = (review) => {
    const updatedReview = {
      ...profileOwnersReview,
      rating: review.rating,
      content: review.content,
    };

    setProfileOwnersReview({ ...updatedReview });
    const newReviews = reviews.map((r) => {
      if (r.id === updatedReview.id) return updatedReview;
      return r;
    });

    setReviews([...newReviews]);
  };

  const hideEditConfirmModal = () => {
    setShowEditModal(false);
    setSelectedReview(null);
  };

  useEffect(() => {
    if (movieId) {
      fetchMovieReviews();
    }
  }, [movieId]);

  return (
    <div className=" dark:bg-primary bg-white min-h-screen py-[50px]">
      <Container className={"xl:px-0 px-2"}>
        <div className=" flex justify-between items-center py-8">
          <h1 className="text-2xl font-semibold dark:text-white text-secondary pt-5">
            <span className=" text-light-subtle dark:text-dark-subtle font-normal">
              Reviews for:{" "}
            </span>
            {movieTitle}
          </h1>

          {/* <ReviewCard /> */}

          <CustomBtnLink
            label={profileOwnersReview ? "View All" : "Find My Review"}
            onClick={findProfileOwnersReview}
            className={"text-lg"}
          />
        </div>

        <NotFoundText text="No Reviews!" visible={!reviews.length} />
        {profileOwnersReview ? (
          <div className="flex justify-between items-center">
            <ReviewCard review={profileOwnersReview} />
            <div className=" flex space-x-4 dark:text-white text-primary text-xl p-3">
              <button
                className=" hover:text-red-700 transition-all duration-200 "
                type="button"
                onClick={displayConfirmModal}
              >
                <BsTrash />
              </button>
              <button type="button" onClick={handleOnEditClick}>
                <BsPencilSquare className=" hover:text-orange-600 transition-all duration-200 " />
              </button>
            </div>
          </div>
        ) : (
          <div className=" space-y-8">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </Container>
      <ConfirmModal
        visible={showConfirmModal}
        title={"Are you sure?"}
        subtitle={"This action will remove this review permanently"}
        onCancel={hideConfirmModal}
        onConfirm={handleDeleteConfirm}
        busy={busy}
      />
      <EditRatingModal
        visible={showEditModal}
        initialState={selectedReview}
        onClose={hideEditConfirmModal}
        onSuccess={handleOnReviewUpdate}
      />
    </div>
  );
};

const ReviewCard = ({ review }) => {
  if (!review) return null;

  const { owner, content, rating } = review;

  return (
    <div className=" flex items-center space-x-3">
      <div className=" flex items-center justify-center aspect-square w-14 h-14 rounded-full bg-light-subtle dark:bg-dark-subtle text-white text-xl select-none">
        {getNameInitial(owner.name)}
      </div>
      <div>
        <div className=" flex items-center gap-10">
          <h2 className=" dark:text-white text-secondary font-semibold text-xl capitalize">
            {owner.name}
          </h2>
          <RatingStar rating={rating} />
        </div>
        {content && (
          <p className=" text-light-subtle dark:text-dark-subtle">{content}</p>
        )}
      </div>
    </div>
  );
};

export default MovieReviews;

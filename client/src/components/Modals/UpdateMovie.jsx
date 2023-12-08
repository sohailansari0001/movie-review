import { useEffect, useState } from "react";
import { ModalContainer, MovieForm } from "../";
import { geMovieForUpdate, updateMovie } from "../../api/movie";
import toast from "react-hot-toast";

const UpdateMovie = ({ visible, onSuccess, movieId }) => {
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleSubmit = async (data) => {
    setBusy(true);

    const { success, message, movie } = await updateMovie(movieId, data);

    setBusy(false);

    if (!success) {
      return toast.error(message);
    }

    toast.success(message);

    setBusy(false);
    onSuccess(movie);
  };

  const fetchMoviesToUpdate = async () => {
    const { success, message, movie } = await geMovieForUpdate(movieId);

    if (!success) {
      return toast.error(message);
    }

    setSelectedMovie(movie);
    setReady(true);
  };
  ``;

  useEffect(() => {
    if (movieId) fetchMoviesToUpdate();
  }, [movieId]);
  return (
    <ModalContainer visible={visible}>
      {ready ? (
        <MovieForm
          initialState={selectedMovie}
          btnTitle={"Update"}
          onSubmit={!busy ? handleSubmit : null}
          busy={busy}
        />
      ) : (
        <div className=" w-full h-full flex justify-center items-center">
          <p className="text-light-subtle text-2xl dark:text-dark-subtle animate-pulse">
            Please Wait...
          </p>
        </div>
      )}
    </ModalContainer>
  );
};

export default UpdateMovie;

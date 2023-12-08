import { useEffect, useState } from "react";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { deleteActor, getActors, searchActor } from "../../api/actor";

import { toast } from "react-hot-toast";
import {
  ConfirmModal,
  NextAndPrevButton,
  NotFoundText,
  SearchForm,
} from "../../components";
import UpdateActor from "../../components/Modals/UpdateActor";
import { useSearch } from "../../hooks";

let currentPageNo = 0;
const limit = 20;

const Actors = () => {
  // states
  const [actors, setActors] = useState([]);
  const [reachedToEnd, setReachedToEnd] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [results, setResults] = useState([]);

  // search provider hook
  const { handleSearch, resetSearch, resultNotFound, setResultNotFound } =
    useSearch();

  // const [currentPageNo, setCurrentPageNo] = useState(0);

  const fetchActors = async (pageNo) => {
    const { profiles, success, message } = await getActors(pageNo, limit);

    if (!success) {
      return toast.error(message);
    }

    if (!profiles.length) {
      // setCurrentPageNo(pageNo - 1);
      currentPageNo = pageNo - 1;
      return setReachedToEnd(true);
    }

    setActors([...profiles]);
  };

  const handleOnNextClick = () => {
    if (reachedToEnd) {
      toast.error("No More actors!");
      return;
    }

    // setCurrentPageNo((prev) => prev + 1);
    currentPageNo += 1;
    fetchActors(currentPageNo);
  };

  const handleOnPrevClick = () => {
    if (currentPageNo <= 0) {
      currentPageNo = 0;
      setReachedToEnd(false);
      toast.error("You are on first page!");
      return;
    }
    setReachedToEnd(false);
    currentPageNo -= 1;

    fetchActors(currentPageNo);
  };

  const handleOnEditClick = (profile) => {
    setShowUpdateModal(true);
    setSelectedProfile(profile);
  };

  const hideUpdateModal = () => {
    setShowUpdateModal(false);
  };

  const handleOnActorUpdate = (profile) => {
    const updatedActors = actors.map((actor) => {
      if (profile.id === actor.id) {
        return profile;
      }
      return actor;
    });

    setActors([...updatedActors]);
  };

  const handleOnSearchSubmit = (value) => {
    setResultNotFound(false);
    if (value === "") {
      handleSearchFormReset();
    }

    handleSearch(searchActor, value, setResults);
  };

  const handleSearchFormReset = () => {
    setResultNotFound(false);
    resetSearch();
    setResults([]);
  };

  const handleOnDeleteClick = (profile) => {
    setSelectedProfile(profile);
    setShowConfirmModal(true);
  };

  const handleOnDeleteConfirm = async () => {
    // setBusy(true);
    setShowConfirmModal(false);
    return toast.error("Delting fuctionality not added!");

    /*
    const { success, message } = await deleteActor(selectedProfile.id);
    setBusy(false);

    if (!success) {
      return toast.error(message);
    }

    toast.success(message);
    setShowConfirmModal(false);
    fetchActors(currentPageNo)
    */
  };

  const hideConfirmModal = () => {
    setShowConfirmModal(false);
  };

  useEffect(() => {
    fetchActors(currentPageNo);
  }, []);

  return (
    <>
      <div className=" p-5">
        <div className=" flex justify-end mb-5">
          <SearchForm
            onSubmit={handleOnSearchSubmit}
            placeholder={"Search Actors"}
            showResetIcon={results.length || resultNotFound}
            onReset={handleSearchFormReset}
          />
        </div>
        {<NotFoundText text={"Result Not Found"} visible={resultNotFound} />}

        <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 gap-4">
          {results.length || resultNotFound
            ? results.map((actor) => (
                <ActorProfile
                  OnEditClick={() => handleOnEditClick(actor)}
                  key={actor.id}
                  profile={actor}
                  onDeleteClick={() => handleOnDeleteClick(actor)}
                />
              ))
            : actors.map((actor) => (
                <ActorProfile
                  OnEditClick={() => handleOnEditClick(actor)}
                  key={actor.id}
                  profile={actor}
                  onDeleteClick={() => handleOnDeleteClick(actor)}
                />
              ))}
        </div>

        {!results.length && !resultNotFound ? (
          <NextAndPrevButton
            onNextClick={handleOnNextClick}
            onPrevClick={handleOnPrevClick}
            className=" mt-8"
          />
        ) : null}
      </div>
      <ConfirmModal
        visible={showConfirmModal}
        subtitle={"This action will remove this profile permanently!"}
        title={"Are You Sure?"}
        busy={busy}
        onConfirm={handleOnDeleteConfirm}
        onCancel={hideConfirmModal}
      />
      <UpdateActor
        visible={showUpdateModal}
        onClose={hideUpdateModal}
        initialState={selectedProfile}
        onSuccess={handleOnActorUpdate}
      />
    </>
  );
};

const ActorProfile = ({ profile, OnEditClick, onDeleteClick }) => {
  const [showOptions, setShowOptions] = useState(false);
  const acceptedNameLength = 15;

  const handleOnMouseEnter = () => {
    setShowOptions(true);
  };
  const handleOnMouseLeave = () => {
    setShowOptions(false);
  };

  const getName = (name) => {
    if (name.length <= acceptedNameLength) {
      return name;
    }

    return name.substring(0, acceptedNameLength) + "...";
  };

  if (!profile) return null;

  const { name, avatar, about = "" } = profile;
  return (
    <div className=" bg-white dark:bg-secondary shadow dark:shadow rounded h-20 overflow-hidden ">
      <div
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
        className=" flex  cursor-pointer relative"
      >
        <img
          src={avatar}
          alt={name}
          className=" w-20  aspect-square rounded-sm object-cover"
        />

        <div className=" px-2">
          <h2 className=" text-xl text-primary dark:text-white font-semibold whitespace-nowrap mb-1">
            {getName(name)}
          </h2>
          <p className="text-primary dark:text-white text-sm">
            {about.substring(0, 40) + " ..."}
          </p>
        </div>

        <Options
          OnEditClick={OnEditClick}
          onDeleteClick={onDeleteClick}
          visible={showOptions}
        />
      </div>
    </div>
  );
};

const Options = ({ visible, onDeleteClick, OnEditClick }) => {
  if (!visible) {
    return null;
  }

  return (
    <div className=" absolute inset-0 bg-primary bg-opacity-25 backdrop-blur-sm  flex items-center justify-center space-x-4">
      <button
        className=" p-2 rounded-full bg-white text-primary hover:opacity-80  hover:bg-red-500 hover:text-white transition-all duration-200"
        type="button"
        onClick={onDeleteClick}
      >
        <BsTrash />
      </button>
      <button
        className=" p-2 rounded-full bg-white text-primary hover:opacity-80 hover:bg-orange-600 hover:text-white transition-all duration-200"
        type="button"
      >
        <BsPencilSquare onClick={OnEditClick} />
      </button>
    </div>
  );
};

export default Actors;

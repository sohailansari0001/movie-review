import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { commonInputClasses } from "../../utils/theme";
import { genderOptions } from "../../utils/options";
import { validateActor } from "../../utils/helper";
import { ImSpinner3 } from "react-icons/im";

// components
import { PosterSelector, Selector } from "../";

// default actor fields
const defaultActorInfo = {
  name: "",
  about: "",
  avatar: null,
  gender: "",
};

const ActorForm = ({ title, btnTitle, busy, onSubmit, initialState }) => {
  // states
  const [actorInfo, setActorInfo] = useState({ ...defaultActorInfo });
  const [selectedAvatarForUI, setSelectedAvatarForUI] = useState("");

  // destructring actor info
  const { name, about, gender } = actorInfo;

  // updating poster url
  const updatePosterForUI = (file) => {
    const url = URL.createObjectURL(file);
    setSelectedAvatarForUI(url);
  };

  // handle change function to store the values in fields
  const handleChange = ({ target }) => {
    const { value, name, files } = target;

    if (name === "avatar") {
      const file = files[0];
      updatePosterForUI(file);
      return setActorInfo({ ...actorInfo, avatar: file });
    }

    setActorInfo({ ...actorInfo, [name]: value });
  };

  // creating  actor and  validating it
  const handleSubmit = (e) => {
    e.preventDefault();

    const { error } = validateActor(actorInfo);

    if (error) {
      return toast.error(error);
    }

    // creating a new form data and submitting it
    const formData = new FormData();

    for (let key in actorInfo) {
      if (key) {
        formData.append(key, actorInfo[key]);
      }
    }

    onSubmit(formData);
  };

  useEffect(() => {
    if (initialState) {
      setActorInfo({ ...initialState, avatar: null });
      setSelectedAvatarForUI(initialState.avatar);
    }
  }, [initialState]);

  return (
    <form
      onSubmit={handleSubmit}
      className="dark:bg-primary bg-white p-3 w-[35rem] rounded"
    >
      <div className=" flex justify-between items-center">
        <h1 className="font-semibold text-xl dark:text-white text-primary">
          {title}
        </h1>
        <button
          className="h-8 w-24 flex justify-center items-center bg-primary text-white dark:bg-white dark:text-primary hover:opacity-80 transition rounded-md font-semibold"
          type="submit"
        >
          {busy ? <ImSpinner3 className="animate-spin" /> : btnTitle}
        </button>
      </div>
      <div className="flex space-x-4 mt-2">
        <PosterSelector
          selectedPoster={selectedAvatarForUI}
          className={"w-36 h-36 aspect-square"}
          name={"avatar"}
          onChange={handleChange}
          label={"Select Avatar"}
          accept="image/*"
        />
        <div className=" flex-grow flex flex-col space-y-2">
          <input
            type="text"
            placeholder="Enter Name"
            className={`${commonInputClasses} border-b-2`}
            name={"name"}
            onChange={handleChange}
            value={name}
          />

          <textarea
            className={`${commonInputClasses} resize-none border-b-2 h-full custom-scroll-bar`}
            placeholder="About..."
            name={"about"}
            onChange={handleChange}
            value={about}
          />
        </div>
      </div>

      <div className="mt-4 w-36">
        <Selector
          options={genderOptions}
          label={"Gender"}
          value={gender}
          onChange={handleChange}
          name={"gender"}
        />
      </div>
    </form>
  );
};

export default ActorForm;

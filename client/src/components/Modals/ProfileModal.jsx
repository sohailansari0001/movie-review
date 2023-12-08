import { useEffect, useState } from "react";
import { ModalContainer } from "../";
import toast from "react-hot-toast";
import { getSingleActor } from "../../api/actor";

const ProfileModal = ({ visible, profileId, onClose }) => {
  const [profile, setProfile] = useState({});

  const fetchActorProfile = async () => {
    const { success, message, actor } = await getSingleActor(profileId);

    if (!success) {
      return toast.error(message);
    }

    setProfile(actor);
  };

  useEffect(() => {
    if (profileId) {
      fetchActorProfile();
    }
  }, [profileId]);

  const { avatar, name, about } = profile;

  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      <div className=" p-5 rounded-md bg-white dark:bg-primary w-72 flex flex-col items-center space-y-3 ">
        <img
          src={avatar}
          alt=""
          className=" w-28 h-28 rounded-full border-2 dark:border-white border-pr "
        />
        <h2 className="dark:text-white text-primary font-semibold text-2xl">
          {name}
        </h2>
        <p className="dark:text-dark-subtle text-light-subtle">{about}</p>
      </div>
    </ModalContainer>
  );
};

export default ProfileModal;

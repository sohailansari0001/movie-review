import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import ModalContainer from "./ModalContainer";

const CastModal = ({ cast = [], visible, onClose, onRemoveClick }) => {
  return (
    <ModalContainer ignoreContainer onClose={onClose} visible={visible}>
      <div className="space-y-2 dark:bg-primary bg-white rounded max-w-[45rem] max-h-[40rem] overflow-auto p-2 custom-scroll-bar">
        <h2 className="text-center text-lg dark:text-dark-subtle text-light-subtle">
          All Cast & Crew
        </h2>
        {cast.map(({ profile, roleAs, leadActor }) => {
          const { name, id, avatar } = profile;
          return (
            <div
              className="flex items-center gap-4 overflow-hidden dark:bg-secondary bg-white drop-shadow-md rounded "
              key={id}
            >
              <img
                className=" w-16 h-16 aspect-square rounded object-cover"
                src={avatar}
                alt={name}
              />
              <div className="w-full flex flex-col justify-between ">
                <div>
                  <p className="font-semibold dark:text-white text-primary">
                    {name}
                  </p>
                  <p className=" textt-sm dark:text-dark-subtle text-light-subtle ">
                    {roleAs}
                  </p>
                </div>
                {leadActor && (
                  <AiOutlineCheck className=" text-light-subtle dark:text-dark-subtle" />
                )}
              </div>
              <button
                type="button"
                className="dark:text-white text-primary hover:opacity-80 transition p-2"
                onClick={() => onRemoveClick(id)}
              >
                <AiOutlineClose />
              </button>
            </div>
          );
        })}
      </div>
    </ModalContainer>
  );
};

export default CastModal;

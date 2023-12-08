import { ImTree } from "react-icons/im";

const GenresSelector = ({ badge, onClick }) => {
  const renderBadge = () => {
    if (!badge) {
      return null;
    }

    return (
      <span className="dark:bg-dark-subtle bg-light-subtle relative top- w-5 h-5 rounded-full flex items-center justify-center text-white text-[0.7rem]">
        {badge <= 9 ? badge : `9+`}
      </span>
    );
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className=" flex items-center justify-center space-x-2 py-1 px-2 border-2 dark:border-dark-subtle border-light-subtle dark:hover:border-white hover:border-primary transition dark:text-dark-subtle text-light-subtle hover:text-primary dark:hover:text-white rounded-md w-full"
    >
      <ImTree />
      <span>Select Genres</span>
      {renderBadge()}
    </button>
  );
};

export default GenresSelector;

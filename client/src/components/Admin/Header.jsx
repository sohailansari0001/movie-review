import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AiOutlinePlus } from "react-icons/ai";
import { BsFillSunFill } from "react-icons/bs";

import { useTheme } from "../../hooks";
import { SearchForm } from "../";

const Header = ({ onAddMovieClick, onAddActorClick }) => {
  // state
  const [showOptions, setShowOptions] = useState(false);

  // theme toggle hook
  const { toggleTheme } = useTheme();
  const navigate = useNavigate();

  // options
  const options = [
    {
      title: "Add Movie",
      onClick: onAddMovieClick,
    },
    {
      title: "Add Actor",
      onClick: onAddActorClick,
    },
  ];

  const handleSearchSubmit = (query) => {
    if (!query.trim()) {
      return;
    }

    navigate(`/search?title=${query}`);
  };

  return (
    <div className="flex items-center justify-between relative px-5">
      <SearchForm
        onSubmit={handleSearchSubmit}
        placeholder={"Search Movies..."}
      />

      <div className="flex items-center space-x-3">
        <button
          onClick={toggleTheme}
          className="  dark:text-white text-light-subtle "
        >
          <BsFillSunFill size={24} className="" />
        </button>
        <button
          onClick={() => setShowOptions(true)}
          className="flex gap-2 items-center dark:border-dark-subtle border-light-subtle   dark:text-dark-subtle text-light-subtle hover:opacity-80 transition-all duration-200 font-semibold border-2 rounded-lg text-lg py-2 px-4"
        >
          <span>Create</span>
          <AiOutlinePlus />
        </button>
      </div>

      {/* creating options */}
      <CreateOptions
        visible={showOptions}
        onClose={() => setShowOptions(false)}
        options={options}
      />
    </div>
  );
};

const CreateOptions = ({ options, visible, onClose }) => {
  const container = useRef();
  const containerID = "option-container";

  // handling close
  const handleClick = (fn) => {
    fn();
    onClose();
  };

  // handing create button opening and closing and animation
  useEffect(() => {
    const handleClose = (e) => {
      if (!visible) return;
      const { parentElement, id } = e.target;
      if (parentElement.id === containerID || id === containerID) return;

      if (container.current) {
        if (!container.current.classList.contains("animate-scale"))
          container.current.classList.add("animate-scale-reverse");
      }
    };

    document.addEventListener("click", handleClose);
    return () => {
      document.removeEventListener("click", handleClose);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      id={containerID}
      ref={container}
      className={`absolute right-0 top-12 flex flex-col space-y-3 p-5 dark:bg-white bg-secondary drop-shadow-lg rounded-md animate-scale z-50 opacity-100 bg-opacity-90`}
      onAnimationEnd={(e) => {
        if (e.target.classList.contains("animate-scale-reverse")) {
          onClose();
        }
        e.target.classList.remove("animate-scale");
      }}
    >
      {options.map(({ title, onClick }) => {
        return (
          <Option
            onClick={() => {
              handleClick(onClick);
            }}
            key={title}
          >
            {title}
          </Option>
        );
      })}
    </div>
  );
};

// options
const Option = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className=" dark:text-secondary text-white  hover:opacity-80 transition-all duration-200"
    >
      {children}
    </button>
  );
};

export default Header;

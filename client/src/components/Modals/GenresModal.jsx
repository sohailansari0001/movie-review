import { useEffect, useState } from "react";
import { ModalContainer, Submit } from "../";
import genres from "../../utils/genres";

const GenresModal = ({ visible, onClose, onSubmit, previousSelection }) => {
  const [selectedGenres, setSelectedGenres] = useState([]);

  const handleGenresSelector = (gen) => {
    let newGenres = [];

    if (selectedGenres.includes(gen)) {
      newGenres = selectedGenres.filter((genre) => genre !== gen);
    } else {
      newGenres = [...selectedGenres, gen];
    }

    setSelectedGenres([...newGenres]);
  };

  const handleSubmit = () => {
    onSubmit(selectedGenres);
    onClose();
  };

  const handleClose = () => {
    setSelectedGenres(previousSelection);
    onClose();
  };

  useEffect(() => {
    setSelectedGenres(previousSelection);
  }, []);

  return (
    <ModalContainer visible={visible} onClose={handleClose}>
      <div className="flex justify-between h-full flex-col items-center">
        <div>
          <h1 className="dark:text-white text-primary text-center text-2xl font-semibold mt-2">
            Select Genres
          </h1>
          <div className=" space-y-3 mt-4">
            {genres.map((gen, i) => {
              return (
                <Genre
                  onClick={() => handleGenresSelector(gen)}
                  key={i}
                  selected={selectedGenres.includes(gen)}
                >
                  {gen}
                </Genre>
              );
            })}
          </div>
        </div>
        <div className="mb-5">
          <Submit
            value={"Select Genres"}
            type={"button"}
            onClick={handleSubmit}
            className={"w-max "}
          />
        </div>
      </div>
    </ModalContainer>
  );
};

const Genre = ({ children, selected, onClick }) => {
  const getSelectedStyle = () => {
    return selected
      ? "dark:bg-white bg-light-subtle dark:!text-primary text-white"
      : "text-primary dark:text-white";
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className={`border-2 dark:border-dark-subtle border-light-subtle   py-1 px-2 rounded mr-3 ${getSelectedStyle()} `}
    >
      {children}
    </button>
  );
};

export default GenresModal;

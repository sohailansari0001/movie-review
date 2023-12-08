const NextAndPrevButton = ({ className = "", onPrevClick, onNextClick }) => {
  const getClasses = () => {
    return "flex justify-end items-center space-x-4";
  };

  return (
    <div className={getClasses() + className}>
      <Button title={"Prev"} onClick={onPrevClick} />

      <Button title={"Next"} onClick={onNextClick} />
    </div>
  );
};

const Button = ({ title, onClick }) => {
  return (
    <button
      type="button"
      className="text-primary bg-light-subtle dark:bg-dark-subtle  py-2 px-4 dark:text-white hover:underline rounded-md text-lg hover:opacity-80 transition-all duration-200"
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default NextAndPrevButton;

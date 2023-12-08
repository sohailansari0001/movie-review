const Title = ({ small, children }) => {
  return (
    <h2
      className={`${
        small ? "text-3xl" : "text-4xl"
      }  dark:text-white text-secondary font-semibold text-center`}
    >
      {children}
    </h2>
  );
};

export default Title;

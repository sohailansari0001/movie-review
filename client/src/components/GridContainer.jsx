const GridContainer = ({ children, className }) => {
  return (
    <div
      className={`grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-3 ${className}`}
    >
      {children}
    </div>
  );
};

export default GridContainer;

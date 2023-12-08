const AppInfoBox = ({ title, subtitle }) => {
  return (
    <div className=" bg-white dark:shadow dark:bg-secondary shadow p-5 rounded">
      <h2 className=" font-semibold text-2xl mb-2 text-primary dark:text-white">
        {title}
      </h2>
      <p className=" text-xl  text-primary dark:text-white">{subtitle}</p>
    </div>
  );
};

export default AppInfoBox;

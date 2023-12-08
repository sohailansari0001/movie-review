const UploadProgress = ({ width, message, visible }) => {
  if (!visible) {
    return null;
  }

  return (
    <div className=" dark:bg-secondary bg-white drop-shadow-lg rounded p-3 overflow-hidden">
      <div className=" h-3 relative dark:bg-dark-subtle bg-light-subtle ">
        <div
          style={{ width: width + "%" }}
          className="h-full absoulute bg-secondary dark:bg-white left-0"
        />
      </div>
      <p className="text-center font-semibold dark:text-dark-subtle text-light-subtle animate-pulse mt-2">
        {message}
      </p>
    </div>
  );
};

export default UploadProgress;

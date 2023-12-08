const NotFoundText = ({ text, visible }) => {
  if (!visible) {
    return null;
  }
  return (
    <h2 className=" font-semibold text-3xl opacity-40 text-secondary dark:text-white text-center py-2">
      {text}
    </h2>
  );
};

export default NotFoundText;

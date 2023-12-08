import { ImSpinner3 } from "react-icons/im";

const Submit = ({ value, className, busy, type, onClick }) => {
  return (
    <button
      type={type || "submit"}
      onClick={onClick}
      className={`w-full rounded-lg dark:bg-white dark:hover:bg-white/90 bg-secondary hover:bg-opacity-90 transition-all duration-200 font-semibold text-lg dark:text-secondary text-white py-4 px-4 cursor-pointer  focus:outline-none h-10 flex items-center justify-center ${className}`}
    >
      {busy ? <ImSpinner3 className="animate-spin" /> : value}
    </button>
  );
};

export default Submit;

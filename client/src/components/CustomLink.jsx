import { Link } from "react-router-dom";

const CustomLink = ({ to, className, children }) => {
  return (
    <Link
      to={to}
      className={`dark:text-dark-subtle text-light-subtle hover:text-primary font-semibold dark:hover:text-white transition-all duration-200 ${className}`}
    >
      {children}
    </Link>
  );
};

export default CustomLink;

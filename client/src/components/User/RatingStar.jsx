import { AiFillStar } from "react-icons/ai";

const RatingStar = ({ rating }) => {
  if (!rating) {
    return (
      <p className=" ml-3 dark:text-highlight-dark text-highlight">
        No Reviews
      </p>
    );
  }

  return (
    <p className="flex items-center ml-3 gap-2 dark:text-highlight-dark text-highlight ">
      <span>{rating}</span>
      <AiFillStar className="text-yellow-500" />
    </p>
  );
};

export default RatingStar;

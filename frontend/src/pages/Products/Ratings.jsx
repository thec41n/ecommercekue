import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const Ratings = ({ value = 0, text }) => {
  const fullStars = Math.floor(value);
  const halfStars = value - fullStars >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStars;

  return (
    <div className="flex items-center gap-1">
      <span className="flex items-center gap-1 text-yellow-500" aria-hidden="true">
        {[...Array(fullStars)].map((_, index) => (
          <FaStar key={`full-${index}`} />
        ))}
        {halfStars === 1 && <FaStarHalfAlt />}
        {[...Array(emptyStars)].map((_, index) => (
          <FaRegStar key={`empty-${index}`} />
        ))}
      </span>
      <span className="sr-only">Rating {value.toFixed(1)} dari 5</span>
      {text && <span className="ml-2 text-sm text-cocoa-light">{text}</span>}
    </div>
  );
};

export default Ratings;

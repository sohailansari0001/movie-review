import { commonPosterUi } from "../../utils/theme";

const PosterSelector = ({
  name,
  selectedPoster,
  onChange,
  accept,
  className,
  label,
}) => {
  return (
    <div>
      <input
        accept={accept}
        onChange={onChange}
        type="file"
        name={name}
        id={name}
        hidden
      />
      <label htmlFor={name}>
        {selectedPoster ? (
          <img
            src={selectedPoster}
            className={`${commonPosterUi}  object-cover ${className}`}
            alt="poster"
            onChange={onChange}
          />
        ) : (
          <PosterUI label={label} className={className} />
        )}
      </label>
    </div>
  );
};

const PosterUI = ({ className, label }) => {
  return (
    <div className={`${commonPosterUi} ${className}`}>
      <span className=" dark:text-dark-subtle text-light-subtle">{label}</span>
    </div>
  );
};

export default PosterSelector;

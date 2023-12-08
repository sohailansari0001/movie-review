export const getToken = () => localStorage.getItem("auth-token");

export const isValidEmail = (email) => {
  const isValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return isValid.test(email);
};

export const validateActor = ({ name, about, gender, avatar }) => {
  if (!name.trim()) {
    return { error: "Actor Name is missing!" };
  }
  if (!about.trim()) {
    return { error: "About section is empty!" };
  }
  if (!gender.trim()) {
    return { error: "Gender is missing!" };
  }

  if (avatar && !avatar.type?.startsWith("image")) {
    return { error: "Invalid image or / avatar file!" };
  }

  return { error: null };
};

export const catchError = (error) => {
  const { response } = error;

  if (response?.data) {
    return response?.data;
  }

  return { error: error.message || error };
};

export const renderItem = (result) => {
  return (
    <div key={result.id} className="flex space-x-2 rounded overflow-hidden">
      <img
        src={result.avatar}
        alt={result.name}
        className="w-16 h-16 object-cover "
      />
      <p className="dark:text-white font-semibold">{result.name}</p>
    </div>
  );
};

export const validateMovie = (movieInfo) => {
  const {
    title,
    storyline,
    language,
    releaseDate,
    status,
    type,
    genres,
    tags,
    cast,
  } = movieInfo;

  if (!title.trim()) {
    return { error: "Title is missing!" };
  }
  if (!storyline.trim()) {
    return { error: "Storyline is missing!" };
  }
  if (!language.trim()) {
    return { error: "Language is missing!" };
  }

  if (!releaseDate.trim()) {
    return { error: "Release Date is missing!" };
  }

  if (!status.trim()) {
    return { error: "Status is missing!" };
  }

  if (!type.trim()) {
    return { error: "Type is missing!" };
  }

  // validation of genres - we are checking if genres array or not
  if (!genres.length) {
    return { error: "Genres are missing!" };
  }

  // here we are checking genres need to field with string value
  for (let gen of genres) {
    if (!gen.trim()) {
      return { error: "Invalid Genres! " };
    }
  }

  // validation of tags - we are checking if tags array or not
  if (!tags.length) {
    return { error: "Tags are missing!" };
  }

  // here we are checking tags need to field with string value
  for (let t of tags) {
    if (!t.trim()) {
      return { error: "Invalid Tags! " };
    }
  }

  // validation of cast - we are checking if cast array or not
  if (!cast.length) {
    return { error: "Cast and crew are missing!" };
  }

  // here we are checking cast need to field with string value
  for (let c of cast) {
    if (typeof c !== "object") {
      return { error: "Invalid Cast! " };
    }
  }

  return { error: null };
};

export const trimTitle = (text = "") => {
  if (text.length <= 20) {
    return text;
  }

  return text.substring(0, 20) + "...";
};

export const convertDate = (date = "") => {
  return date.split("T")[0];
};

export const convertReviewCount = (count = 0) => {
  if (count <= 999) {
    return count;
  }
  return parseFloat(count / 1000).toFixed(1) + "k";
};

export const getPoster = (posters = []) => {
  const { length } = posters;

  if (!length) {
    return null;
  }

  // has more than two poster
  if (length > 2) {
    return posters[1];
  }

  return posters[0];
};

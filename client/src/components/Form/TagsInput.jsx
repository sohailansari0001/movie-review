import { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

const TagsInput = ({ name, value, onChange }) => {
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState([]);

  const input = useRef();
  const tagsInput = useRef();

  const handleOnChange = ({ target }) => {
    const { value } = target;

    if (value !== ",") {
      setTag(value);
    }

    onChange(tags);
  };

  const handleKeyDown = (e) => {
    const { key } = e;
    if (key === "," || key === "Enter") {
      if (!tag) return;

      if (tags.includes(tag)) return setTag("");

      setTags([...tags, tag]);
      setTag("");
    }

    if (key === "Enter") {
      e.preventDefault(); // Prevent the default behavior of Enter key
      // You can optionally add custom behavior here, such as triggering an action
    }

    if (key === "Backspace" && !tag && tags.length) {
      const newTags = tags.filter((_, index) => index !== tags.length - 1);
      setTags([...newTags]);
    }
  };

  const removeTag = (tagToRemove) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags([...newTags]);
  };

  const handleOnFocus = () => {
    tagsInput.current.classList.remove(
      "dark:border-dark-subtle",
      "border-light-subtle"
    );
    tagsInput.current.classList.add("dark:border-white", "border-primary");
  };

  const handleOnBlur = () => {
    tagsInput.current.classList.add(
      "dark:border-dark-subtle",
      "border-light-subtle"
    );
    tagsInput.current.classList.remove("dark:border-white", "border-primary");
  };

  useEffect(() => {
    input.current?.scrollIntoView(false);
  }, [tag]);

  useEffect(() => {
    if (value?.length) {
      setTags(value);
    }
  }, [value]);

  return (
    <div>
      <div
        ref={tagsInput}
        onKeyDown={handleKeyDown}
        className=" border-2 bg-transparent h-10 dark:border-dark-subtle border-light-subtle px-2 rounded w-full text-white flex items-center gap-2 overflow-x-auto custom-scroll-bar"
      >
        {tags?.map((t, i) => (
          <Tag key={i} onClick={() => removeTag(t)}>
            {t}
          </Tag>
        ))}
        <input
          ref={input}
          type="text"
          className="h-full w-full  bg-transparent outline-none dark:text-white "
          placeholder="Tag One, Tag Two"
          value={tag}
          name={name}
          onChange={handleOnChange}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
        />
      </div>
    </div>
  );
};

const Tag = ({ children, onClick }) => {
  return (
    <span className="dark:bg-white bg-primary dark:text-primary text-white flex items-center justify-center text-sm px-2 py-1 gap-1 rounded-md whitespace-nowrap">
      {children}
      <button type="button" onClick={onClick}>
        <AiOutlineClose size={12} />
      </button>
    </span>
  );
};

export default TagsInput;

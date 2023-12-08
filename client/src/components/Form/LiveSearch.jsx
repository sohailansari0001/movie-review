import { useEffect, useState } from "react";
import { commonInputClasses } from "../../utils/theme";
import { SearchResults } from "../";
const LiveSearch = ({
  value = "",
  placeholder = "",
  results = [],
  name,
  resultContainerStyle,
  selectedResultStyle,
  inputStyle,
  renderItem = null,
  onChange = null,
  onSelect = null,
}) => {
  // states
  const [displaySearch, setDisplaySearch] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [defaultValue, setDefaultValue] = useState("");

  // if we have result and focus showing search field
  const handleOnFocus = () => {
    if (results.length) setDisplaySearch(true);
  };

  // closing search field
  const closeSearch = () => {
    setDisplaySearch(false);
    setFocusedIndex(-1);
  };

  // if we click on blur part need to close the modal
  const handleOnBlur = () => {
    closeSearch();
  };

  // handling item selection and closing it after selection
  const handleSelection = (selectedItem) => {
    if (selectedItem) {
      onSelect(selectedItem);
      closeSearch();
    }
  };

  // handling keyboard keys
  const handleKeyDown = ({ key }) => {
    let nextCount;

    const keys = ["ArrowDown", "ArrowUp", "Enter", "Escape"];
    if (!keys.includes(key)) return;

    // move selection up and down
    if (key === "ArrowDown") {
      nextCount = (focusedIndex + 1) % results.length;
    }
    if (key === "ArrowUp") {
      nextCount = (focusedIndex + results.length - 1) % results.length;
    }
    if (key === "Escape") return closeSearch();

    if (key === "Enter") return handleSelection(results[focusedIndex]);

    setFocusedIndex(nextCount);
  };

  // input styles
  const getInputStyle = () => {
    return inputStyle
      ? inputStyle
      : `${commonInputClasses} border-2 rounded p-1  text-lg`;
  };

  // setting value
  const handleChange = (e) => {
    setDefaultValue(e.target.value);
    onChange && onChange(e);
  };

  // use effect for value of input search
  useEffect(() => {
    setDefaultValue(value);
  }, [value]);

  // using effect if we have result then only we want to show result
  useEffect(() => {
    if (results.length) return setDisplaySearch(true);
    setDisplaySearch(false);
  }, [results.length]);

  return (
    <div
      className="relative outline-none"
      tabIndex={1}
      onKeyDown={handleKeyDown}
      onBlur={handleOnBlur}
    >
      <input
        type="text"
        id={name}
        name={name}
        className={getInputStyle()}
        placeholder={placeholder}
        onFocus={handleOnFocus}
        value={defaultValue}
        onChange={handleChange}
        autoComplete="off"
        // onBlur={handleOnBlur}
        // onKeyDown={handleKeyDown}
      />

      <SearchResults
        results={results}
        visible={displaySearch}
        focusedIndex={focusedIndex}
        onSelect={handleSelection}
        renderItem={renderItem}
        resultContainerStyle={resultContainerStyle}
        selectedResultStyle={selectedResultStyle}
      />
    </div>
  );
};

export default LiveSearch;

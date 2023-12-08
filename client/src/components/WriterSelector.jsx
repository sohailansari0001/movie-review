import { useState } from "react";
import { renderItem } from "../utils/helper";
import { searchActor } from "../api/actor";
import { useSearch } from "../hooks";

// component
import LiveSearch from "./Form/LiveSearch";

const WriterSelector = ({ onSelect }) => {
  const [value, setValue] = useState("");
  const [profiles, setProfiles] = useState([]);

  //   use search hook
  const { handleSearch, resetSearch } = useSearch();

  const handleOnChange = ({ target }) => {
    const { value } = target;

    setValue(value);
    handleSearch(searchActor, value, setProfiles);
  };

  const handleOnSelect = (profile) => {
    setValue("");
    onSelect(profile);
    setProfiles([]);
    resetSearch();
  };
  return (
    <LiveSearch
      name="writers"
      results={profiles}
      placeholder="Search profile"
      renderItem={renderItem}
      onSelect={handleOnSelect}
      onChange={handleOnChange}
      value={value}
    />
  );
};

export default WriterSelector;

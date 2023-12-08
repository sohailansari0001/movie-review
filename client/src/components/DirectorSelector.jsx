import { useState } from "react";
import { renderItem } from "../utils/helper";
import { useSearch } from "../hooks";
import { searchActor } from "../api/actor";

// components
import { LiveSearch, Label } from "./";

const DirectorSelector = ({ onSelect }) => {
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
    setValue(profile.name);
    onSelect(profile);
    setProfiles([]);
    resetSearch();
  };

  return (
    <div className=" flex-col-1">
      <Label htmlFor={"director"}>Director</Label>
      <LiveSearch
        name={"director"}
        placeholder="Search Profile"
        onSelect={handleOnSelect}
        results={profiles}
        renderItem={renderItem}
        value={value}
        onChange={handleOnChange}
      />
    </div>
  );
};

export default DirectorSelector;

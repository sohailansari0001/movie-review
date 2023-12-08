import { createContext, useState } from "react";
import { toast } from "react-hot-toast";

export const SearchContext = createContext();

// creating debounce function to handle live search field
let timoeoutId;

const debounce = (func, delay) => {
  return (...args) => {
    if (timoeoutId) clearTimeout(timoeoutId);
    timoeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

const SearchProvider = ({ children }) => {
  // states
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [resultNotFound, setResultNotFound] = useState(false);

  // searching results and saving them in states
  const search = async (method, query, updaterFun) => {
    const { success, message, results } = await method(query);

    if (!success) {
      return toast.error(message);
    }

    if (!results.length) {
      setResults([]);
      updaterFun && updaterFun([]);
      return setResultNotFound(true);
    }

    setResultNotFound(false);
    setResults(results);
    updaterFun && updaterFun([...results]);
  };

  // calling funion
  const debounceFunc = debounce(search, 300);

  // handling search field when we type
  const handleSearch = (method, query, updaterFun) => {
    setSearching(true);

    if (!query.trim()) {
      updaterFun && updaterFun([]);
      return resetSearch();
    }

    debounceFunc(method, query, updaterFun);
  };

  // resetting all field
  const resetSearch = () => {
    setSearching(false);
    setResults([]);
    setResultNotFound(false);
  };

  return (
    <SearchContext.Provider
      value={{
        handleSearch,
        searching,
        resultNotFound,
        results,
        resetSearch,
        setResultNotFound,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchProvider;

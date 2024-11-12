import { SearchIcon } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";

const Search = () => {
  return (
    <form className="lg:max-w-lg md:max-w-md max-w-xs flex items-center w-full">
      <div className="relative flex-grow">
        <input
          type="text"
          placeholder="Search"
          name="searchVideo"
          className="rounded-l-3xl px-6 pl-10 py-1 w-full border bg-transparent text-white focus:outline-none"
        />
        <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-200" />
      </div>
      <button
        type="submit"
        className="rounded-r-3xl bg-transparent outline-none border px-3 py-1 text-white"
      >
        Search
      </button>
    </form>
  );
};

export default Search;

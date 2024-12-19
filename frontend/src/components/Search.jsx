import { SearchIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const Search = () => {
  const navigate = useNavigate();
  const searchInput = useLocation();
  const urlSearch = new URLSearchParams(searchInput?.search)
  const query = urlSearch.getAll("query")
  const [search, setSearch] = useState(query)
  
  const handleSearchChange = (e) => {
    setSearch(e.target.value)
  }

  const handleSearch = (e) => {
    e.preventDefault()
  
    if(search){
      navigate(`/search?query=${search}`)
    }else{
      navigate("/search")
    }
  }

  return (
    <form className="lg:max-w-lg md:max-w-md max-w-xs flex items-center w-full" onSubmit={handleSearch}>
      <div className="relative flex-grow">
        <input
          type="text"
          placeholder="Search"
          name="search"
          value={search}
          onChange={handleSearchChange}
          className="rounded-l-3xl px-6 pl-7 sm:pl-10 py-1 w-full border bg-transparent text-white focus:outline-none"
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

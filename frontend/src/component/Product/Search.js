import React, { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom"; 
import MetaData from "../layout/MetaData";
import "./Search.css";

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]); 
  const navigate = useNavigate(); 

  // Hits the backend API on every single keystroke
  const inputChangeHandler = async (e) => {
    const value = e.target.value;
    setKeyword(value);

    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`/api/v1/products/suggestions?query=${value}`);
      const data = await response.json();
      
      if (data.success) {
        setSuggestions(data.suggestions); 
      }
    } catch (error) {
      console.error("Error fetching live suggestions:", error);
    }
  };

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products/${keyword}`); 
    } else {
      navigate("/products");
    }
  };

  const suggestionClickHandler = (selectedWord) => {
    setKeyword(selectedWord);
    setSuggestions([]); 
    navigate(`/products/${selectedWord}`); 
  };

  return (
    <Fragment>
      <MetaData title="Search A Product -- ECOMMERCE" />
      <div className="searchContainer">
        <form className="searchBox" onSubmit={searchSubmitHandler}>
          <div className="inputWrapper">
            <input
              type="text"
              value={keyword}
              placeholder="Search a Product (live matching)..."
              onChange={inputChangeHandler} 
            />
            
            {/* Google style dropdown overlay list */}
            {suggestions.length > 0 && (
              <ul className="suggestionList">
                {suggestions.map((item, index) => (
                  <li key={index} onClick={() => suggestionClickHandler(item)}>
                    🔍 {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <input type="submit" value="Search" />
        </form>
      </div>
    </Fragment>
  );
};

export default Search;
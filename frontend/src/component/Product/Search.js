import React, { useState, useEffect, Fragment } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getProduct } from "../../actions/productAction";
import ProductCard from "../Home/ProductCard";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";
import "./Search.css";

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dbCategories, setDbCategories] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getProduct());

    // Fetch live categories created by Admin from database
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/v1/categories");
        const data = await res.json();
        if (data.success) {
          setDbCategories(data.categories.map((c) => c.name));
        }
      } catch (err) {
        console.error("Failed to load categories from DB:", err);
      }
    };

    fetchCategories();
  }, [dispatch]);

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

  // Group fetched products dynamically by category
  const groupedProducts = (products || []).reduce((acc, product) => {
    const cat = product.category || "Uncategorized";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {});

  // Merge categories from DB with any categories already present on active products
  const productCategories = Object.keys(groupedProducts);
  const combinedCategoriesList = [
    "All",
    ...Array.from(new Set([...dbCategories, ...productCategories])),
  ];

  // Filter category sections to display
  const activeCategoriesToDisplay = combinedCategoriesList.filter((cat) => {
    if (cat === "All") return false;
    if (selectedCategory !== "All" && cat.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }

    const searchLower = keyword.toLowerCase();
    const categoryMatches = cat.toLowerCase().includes(searchLower);
    const hasMatchingProducts = (groupedProducts[cat] || []).some((product) =>
      product.name.toLowerCase().includes(searchLower)
    );

    return categoryMatches || hasMatchingProducts || selectedCategory === cat;
  });

  return (
    <Fragment>
      <MetaData title="Explore Categories -- ECOMMERCE" />

      {/* Sticky Search Bar & Category Chips */}
      <div className="stickySearchHeader">
        <form className="searchBox" onSubmit={searchSubmitHandler}>
          <div className="inputWrapper">
            <input
              type="text"
              value={keyword}
              placeholder="Search products or categories..."
              onChange={inputChangeHandler}
            />
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
          <button type="submit">Search</button>
        </form>

        {/* Dynamic Category Chips Bar */}
        <div className="categoryChipsBar">
          {combinedCategoriesList.map((cat) => (
            <button
              key={cat}
              className={`chip ${selectedCategory === cat ? "activeChip" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Category Sections Grid */}
      <div className="searchCategoryContainer">
        {loading ? (
          <Loader />
        ) : activeCategoriesToDisplay.length === 0 ? (
          <div className="noProductsFound">
            <p>No products found under "{selectedCategory}"</p>
            <button className="resetFilterBtn" onClick={() => setSelectedCategory("All")}>
              Show All Categories
            </button>
          </div>
        ) : (
          activeCategoriesToDisplay.map((category) => {
            const items = groupedProducts[category] || [];
            const filteredItems = items.filter(
              (p) =>
                p.name.toLowerCase().includes(keyword.toLowerCase()) ||
                category.toLowerCase().includes(keyword.toLowerCase())
            );

            return (
              <div key={category} className="categoryBlock">
                <div className="categoryHeader">
                  <div className="titleGroup">
                    <h2>{category}</h2>
                    <span className="countBadge">{filteredItems.length} items</span>
                  </div>
                  <Link
                    to={`/products?category=${encodeURIComponent(category)}`}
                    className="viewAllBtn"
                  >
                    View All &rarr;
                  </Link>
                </div>

                {filteredItems.length > 0 ? (
                  <div className="categoryHorizontalRow">
                    {filteredItems.map((product) => (
                      <div className="compactCardWrapper" key={product._id}>
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="emptyCategoryText">
                    No products added to {category} yet.
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </Fragment>
  );
};

export default Search;
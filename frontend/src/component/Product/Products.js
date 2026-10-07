import React, { Fragment, useEffect, useState } from "react";
import "./Products.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProduct } from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import Pagination from "react-js-pagination";
import Slider from "@material-ui/core/Slider";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import { useParams } from "react-router-dom";

// Default static categories
const DEFAULT_CATEGORIES = [
  "Laptop",
  "Footwear",
  "Bottom",
  "Tops",
  "Attire",
  "Camera",
  "SmartPhones",
];

const Products = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { keyword } = useParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 250000]);
  const [category, setCategory] = useState("");
  const [categoriesList, setCategoriesList] = useState(DEFAULT_CATEGORIES);
  const [ratings, setRatings] = useState(0);

  // Debounced states for background API calls
  const [debouncedPrice, setDebouncedPrice] = useState([0, 250000]);
  const [debouncedRatings, setDebouncedRatings] = useState(0);

  const {
    products,
    loading,
    error,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.products);

  const finalProducts = products?.products || products || [];

  // Fetch Admin-created categories and merge with default list
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/v1/categories");
        const data = await res.json();

        let dbCatNames = [];
        if (data.success && Array.isArray(data.categories)) {
          dbCatNames = data.categories.map((c) => c.name);
        }

        const mergedCategories = Array.from(
          new Set([...DEFAULT_CATEGORIES, ...dbCatNames])
        );

        setCategoriesList(mergedCategories);
      } catch (err) {
        console.error("Failed to fetch categories in Products page:", err);
      }
    };

    fetchCategories();
  }, []);

  // Debounce price slider
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPrice(price);
    }, 400);
    return () => clearTimeout(timer);
  }, [price]);

  // Debounce ratings slider
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedRatings(ratings);
    }, 400);
    return () => clearTimeout(timer);
  }, [ratings]);

  // Trigger dispatch only on debounced changes
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    dispatch(
      getProduct(keyword, currentPage, debouncedPrice, category, debouncedRatings)
    );
  }, [
    dispatch,
    keyword,
    currentPage,
    debouncedPrice,
    category,
    debouncedRatings,
    alert,
    error,
  ]);

  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
  };

  const clearFiltersHandler = () => {
    setPrice([0, 250000]);
    setCategory("");
    setRatings(0);
  };

  return (
    <Fragment>
      <MetaData title="PRODUCTS -- ECOMMERCE" />
      <div className="productsPageWrapper">
        <h2 className="productsHeading">Explore Products</h2>

        <div className="productsPage">
          {/* Sidebar Filters */}
          <aside className="filterBox">
            <div className="filterHeader">
              <h3 className="filterTitle">Filters</h3>
              {(category || ratings > 0 || price[0] > 0 || price[1] < 250000) && (
                <button className="clearFiltersBtn" onClick={clearFiltersHandler}>
                  Reset
                </button>
              )}
            </div>

            <div className="filterSection">
              <h4 className="filterSubHeading">Price Range</h4>
              <Slider
                value={price}
                onChange={priceHandler}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                min={0}
                max={250000}
                className="customSlider"
              />
              <div className="priceLabels">
                <span className="priceBadge">₹{price[0].toLocaleString()}</span>
                <span className="priceBadge">₹{price[1].toLocaleString()}</span>
              </div>
            </div>

            <div className="filterSection">
              <h4 className="filterSubHeading">Category</h4>
              <ul className="categoryBox">
                {categoriesList.map((cat) => (
                  <li
                    className={`category-link ${
                      category === cat ? "activeCategory" : ""
                    }`}
                    key={cat}
                    onClick={() => setCategory(category === cat ? "" : cat)}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            </div>

            <div className="filterSection">
              <h4 className="filterSubHeading">Rating Above</h4>
              <Slider
                value={ratings}
                onChange={(e, newRating) => setRatings(newRating)}
                aria-labelledby="continuous-slider"
                valueLabelDisplay="auto"
                min={0}
                max={5}
                className="customSlider"
              />
            </div>
          </aside>

          {/* Product Grid with Inline Loading Overlay */}
          <main className={`products ${loading ? "productsUpdating" : ""}`}>
            {finalProducts && finalProducts.length > 0 ? (
              finalProducts.map((product) => (
                <div key={product._id} className="productCardWrapper">
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              !loading && (
                <div className="noProductsBox">
                  <p className="noProductsText">
                    No products found matching your active filters.
                  </p>
                  <button onClick={clearFiltersHandler} className="clearFiltersBtnLarge">
                    Clear Filters
                  </button>
                </div>
              )
            )}
          </main>
        </div>

        {/* Pagination Controls */}
        {resultPerPage < filteredProductsCount && (
          <div className="paginationBox">
            <Pagination
              activePage={currentPage}
              itemsCountPerPage={resultPerPage}
              totalItemsCount={productsCount}
              onChange={(e) => setCurrentPage(e)}
              nextPageText="Next"
              prevPageText="Prev"
              firstPageText="First"
              lastPageText="Last"
              itemClass="page-item"
              linkClass="page-link"
              activeClass="pageItemActive"
              activeLinkClass="pageLinkActive"
            />
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Products;
import React, { Fragment, useEffect } from "react";
import "./Home.css";
import ProductCard from "./ProductCard";
import MetaData from "../layout/MetaData";
import { clearErrors, getProduct } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";

const Home = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct());
  }, [dispatch, error, alert]);

  const productList = Array.isArray(products)
    ? products
    : products?.products || [];

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="STORE" />

          {/* Hero Section */}
          <section className="hero">
            <h1>
              Essential Quality.
              <br />
              Everyday Luxury.
            </h1>
            <p>Explore our latest arrivals crafted for modern living.</p>
            <a href="#container" className="heroBtn">
              Shop Collection &darr;
            </a>
          </section>

          {/* Product Section */}
          <main className="mainContent">
            <div className="sectionHeader">
              <h2>Featured Products</h2>
            </div>

            <div className="container" id="container">
              {productList.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </main>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
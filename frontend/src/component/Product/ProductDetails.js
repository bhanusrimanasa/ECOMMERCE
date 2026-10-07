import React, { Fragment, useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import "./ProductDetails.css";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  clearErrors,
  getProductDetails,
  newReview,
} from "../../actions/productAction";
import ReviewCard from "./ReviewCard";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import { addItemsToCart } from "../../actions/cartAction";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import { NEW_REVIEW_RESET } from "../../constants/productConstants";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { id } = useParams();

  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );

  const { success, error: reviewError } = useSelector(
    (state) => state.newReview
  );

  const options = {
    size: "large",
    value: product?.ratings || 0,
    readOnly: true,
    precision: 0.5,
  };

  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const increaseQuantity = () => {
    if (product?.Stock <= quantity) return;
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity <= 1) return;
    setQuantity((prev) => prev - 1);
  };

  const addToCartHandler = () => {
    dispatch(addItemsToCart(id, quantity));
    alert.success("Item Added To Cart");
  };

  const submitReviewToggle = () => {
    setOpen(!open);
  };

  const reviewSubmitHandler = () => {
    const myForm = new FormData();
    myForm.set("rating", rating);
    myForm.set("comment", comment);
    myForm.set("productId", id);

    dispatch(newReview(myForm));
    setOpen(false);
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (reviewError) {
      alert.error(reviewError);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Review Submitted Successfully");
      dispatch({ type: NEW_REVIEW_RESET });
    }

    dispatch(getProductDetails(id));
  }, [dispatch, id, error, alert, reviewError, success]);

  return (
    <Fragment>
      {loading || !product ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={`${product.name || "Product Details"} -- STORE`} />

          <main className="productDetailsContainer">
            <div className="ProductDetails">
              {/* Carousel */}
              <div className="carouselWrapper">
                <Carousel
                  indicatorIconButtonProps={{
                    style: { color: "#334155" },
                  }}
                  activeIndicatorIconButtonProps={{
                    style: { color: "#f59e0b" },
                  }}
                >
                  {product.images &&
                    product.images.map((item, i) => (
                      <img
                        className="CarouselImage"
                        key={item.url || i}
                        src={item.url}
                        alt={`Slide ${i}`}
                      />
                    ))}
                </Carousel>
              </div>

              {/* Product Info */}
              <div className="productInfo">
                <div className="detailsBlock-1">
                  <h2>{product.name}</h2>
                </div>

                <div className="detailsBlock-2">
                  <Rating {...options} />
                  <span className="detailsBlock-2-span">
                    ({product.numOfReviews || 0}{" "}
                    {product.numOfReviews === 1 ? "Review" : "Reviews"})
                  </span>
                </div>

                <div className="detailsBlock-3">
                  <h1>{`₹${product.price}`}</h1>

                  <div className="detailsBlock-3-1">
                    <div className="detailsBlock-3-1-1">
                      <button onClick={decreaseQuantity}>-</button>
                      <input readOnly type="number" value={quantity} />
                      <button onClick={increaseQuantity}>+</button>
                    </div>
                    <button
                      disabled={product.Stock < 1}
                      onClick={addToCartHandler}
                      className="addToCartBtn"
                    >
                      Add to Cart
                    </button>
                  </div>

                  <p className="stockStatus">
                    Status:{" "}
                    <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                      {product.Stock < 1 ? "Out of Stock" : "In Stock"}
                    </b>
                  </p>
                </div>

                <div className="detailsBlock-4">
                  <h3>Description</h3>
                  <p>{product.description}</p>
                </div>

                <button onClick={submitReviewToggle} className="submitReview">
                  Write a Review
                </button>
              </div>
            </div>

            {/* Customer Reviews */}
            <section className="reviewsSection">
              <h3 className="reviewsHeading">Customer Reviews</h3>

              {product.reviews && product.reviews[0] ? (
                <div className="reviews">
                  {product.reviews.map((review) => (
                    <ReviewCard key={review._id} review={review} />
                  ))}
                </div>
              ) : (
                <p className="noReviews">
                  No reviews yet. Be the first to share your thoughts!
                </p>
              )}
            </section>
          </main>

          {/* Review Dialog */}
          <Dialog
            aria-labelledby="submit-dialog-title"
            open={open}
            onClose={submitReviewToggle}
            PaperProps={{
              style: {
                backgroundColor: "#1e293b",
                color: "#ffffff",
                borderRadius: "12px",
                padding: "0.5rem",
              },
            }}
          >
            <DialogTitle id="submit-dialog-title" style={{ color: "#ffffff" }}>
              Submit Product Review
            </DialogTitle>
            <DialogContent className="submitDialog">
              <Rating
                onChange={(e) => setRating(Number(e.target.value))}
                value={rating}
                size="large"
              />

              <textarea
                className="submitDialogTextArea"
                cols="30"
                rows="5"
                placeholder="Write your review here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </DialogContent>
            <DialogActions>
              <Button onClick={submitReviewToggle} style={{ color: "#94a3b8" }}>
                Cancel
              </Button>

              <Button
                onClick={reviewSubmitHandler}
                style={{
                  backgroundColor: "#f59e0b",
                  color: "#0f172a",
                  fontWeight: "bold",
                }}
              >
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductDetails;
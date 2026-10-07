import React, { Fragment, useEffect, useState } from "react";
import "./orderDetails.css";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import { Link, useParams } from "react-router-dom";
import { getOrderDetails, requestReturnOrder, clearErrors } from "../../actions/orderAction";
import { RETURN_ORDER_RESET } from "../../constants/orderConstants";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";

const OrderDetails = () => {
  const { order, error, loading } = useSelector((state) => state.orderDetails);
  const { isReturned, error: returnError, loading: returnLoading } = useSelector(
    (state) => state.returnOrder || {}
  );

  const dispatch = useDispatch();
  const alert = useAlert();
  const { id } = useParams();

  const [openReturnModal, setOpenReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState("");

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (returnError) {
      alert.error(returnError);
      dispatch(clearErrors());
    }

    if (isReturned) {
      alert.success("Return request submitted successfully!");
      dispatch({ type: RETURN_ORDER_RESET });
      setOpenReturnModal(false);
      dispatch(getOrderDetails(id));
    } else {
      dispatch(getOrderDetails(id));
    }
  }, [dispatch, alert, error, returnError, isReturned, id]);

  const handleReturnSubmit = (e) => {
    e.preventDefault();
    if (!returnReason.trim()) {
      alert.error("Please enter a reason for your return.");
      return;
    }
    dispatch(requestReturnOrder(id, returnReason));
  };

  const isPaid = order?.paymentInfo?.status === "succeeded";
  const isDelivered = order?.orderStatus === "Delivered";
  const hasReturnRequested = order?.returnStatus && order?.returnStatus !== "Not Requested";

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={`Order Details #${id}`} />
          <div className="orderDetailsPage">
            <div className="orderDetailsWrapper">
              
              {/* Back Link */}
              <Link to="/orders" className="backLink">
                ← Back to My Orders
              </Link>

              {/* Main Full-Width Order Card */}
              <div className="orderCard">
                
                {/* Header Bar */}
                <div className="cardHeader">
                  <div className="headerMeta">
                    <div>
                      <span className="metaLabel">ORDER ID</span>
                      <span className="orderIdText">#{order?._id}</span>
                    </div>
                    <div>
                      <span className="metaLabel">PAYMENT</span>
                      <span className={`statusPill ${isPaid ? "paid" : "unpaid"}`}>
                        {isPaid ? "PAID" : "UNPAID"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Status Bar */}
                <div className="trackerSection">
                  <div className="trackerStep active">
                    <div className="stepDot" />
                    <span>Order Placed</span>
                  </div>
                  <div className={`trackerLine ${isDelivered ? "active" : ""}`} />
                  <div className={`trackerStep ${isDelivered ? "active" : "pending"}`}>
                    <div className="stepDot" />
                    <span>{isDelivered ? "Delivered" : "Processing"}</span>
                  </div>
                </div>

                {/* Return Order Status / Action Banner */}
                {isDelivered && (
                  <div className="sectionBlock returnBlock">
                    <h3 className="sectionTitle">Return Status</h3>
                    <div className="returnStatusRow">
                      <span className="metaLabel">STATUS: </span>
                      <span className="returnBadge">{order?.returnStatus}</span>
                    </div>

                    {order?.returnReason && (
                      <p className="returnReasonText">
                        <b>Reason:</b> {order.returnReason}
                      </p>
                    )}

                    {!hasReturnRequested && (
                      <button
                        className="returnActionBtn"
                        onClick={() => setOpenReturnModal(true)}
                      >
                        Request Return
                      </button>
                    )}
                  </div>
                )}

                {/* Products List Section */}
                <div className="sectionBlock">
                  <h3 className="sectionTitle">Items Ordered</h3>
                  <div className="itemsContainer">
                    {order?.orderItems &&
                      order.orderItems.map((item) => (
                        <div key={item.product} className="itemRow">
                          <img src={item.image} alt={item.name} className="itemImg" />
                          <div className="itemDetails">
                            <Link to={`/product/${item.product}`} className="itemName">
                              {item.name}
                            </Link>
                            <span className="itemQty">
                              Quantity: {item.quantity} × ₹{item.price?.toLocaleString()}
                            </span>
                          </div>
                          <div className="itemPrice">
                            ₹{(item.price * item.quantity)?.toLocaleString()}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Footer Grid: Delivery Info + Payment Summary */}
                <div className="cardFooterGrid">
                  
                  {/* Delivery Address */}
                  <div className="footerBox">
                    <h4>Delivery Address</h4>
                    <p className="recipientName">{order?.user?.name}</p>
                    <p className="addressText">
                      {order?.shippingInfo?.address}, {order?.shippingInfo?.city},{" "}
                      {order?.shippingInfo?.state} - {order?.shippingInfo?.pinCode}
                    </p>
                    <p className="phoneText">Phone: {order?.shippingInfo?.phoneNo}</p>
                  </div>

                  {/* Order Summary */}
                  <div className="footerBox">
                    <h4>Payment Summary</h4>
                    <div className="summaryRow">
                      <span>Items Subtotal</span>
                      <span>₹{order?.itemsPrice?.toLocaleString()}</span>
                    </div>
                    <div className="summaryRow">
                      <span>Shipping Fee</span>
                      <span>₹{order?.shippingPrice?.toLocaleString()}</span>
                    </div>
                    <div className="summaryRow">
                      <span>Tax</span>
                      <span>₹{order?.taxPrice?.toLocaleString()}</span>
                    </div>
                    <div className="summaryRow totalRow">
                      <span>Total Amount</span>
                      <span>₹{order?.totalPrice?.toLocaleString()}</span>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>

          {/* Modal for Return Request */}
          {openReturnModal && (
            <div className="returnModalOverlay">
              <div className="returnModalBox">
                <h3>Request Order Return</h3>
                <form onSubmit={handleReturnSubmit}>
                  <textarea
                    placeholder="Enter reason for return..."
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    rows="4"
                    required
                  />
                  <div className="returnModalButtons">
                    <button
                      type="button"
                      className="cancelBtn"
                      onClick={() => setOpenReturnModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="submitBtn"
                      disabled={returnLoading}
                    >
                      {returnLoading ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default OrderDetails;
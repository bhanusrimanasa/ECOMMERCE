import React, { Fragment, useEffect } from "react";
import "./myOrders.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, myOrders } from "../../actions/orderAction";
import Loader from "../layout/Loader/Loader";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import LaunchIcon from "@material-ui/icons/Launch";

const MyOrders = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { loading, error, orders } = useSelector((state) => state.myOrders);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    dispatch(myOrders());
  }, [dispatch, alert, error]);

  return (
    <Fragment>
      <MetaData title={`${user?.name || "User"} - My Orders`} />

      {loading ? (
        <Loader />
      ) : (
        <div className="myOrdersPage">
          <div className="ordersContainer">
            <div className="ordersHeader">
              <h2>My Orders</h2>
              <span>{orders?.length || 0} Orders Placed</span>
            </div>

            {orders && orders.length > 0 ? (
              <div className="ordersList">
                {orders.map((order) => {
                  const isDelivered = order.orderStatus === "Delivered";
                  const orderDate = new Date(order.createdAt).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  );

                  return (
                    <div key={order._id} className="fullOrderCard">
                      {/* Top Bar with Metadata */}
                      <div className="orderCardHeader">
                        <div className="headerMetaGroup">
                          <div className="metaItem">
                            <span className="metaLabel">ORDER PLACED</span>
                            <span className="metaValue">{orderDate}</span>
                          </div>
                          <div className="metaItem">
                            <span className="metaLabel">TOTAL</span>
                            <span className="metaValue highlight">
                              ₹{order.totalPrice.toLocaleString()}
                            </span>
                          </div>
                          <div className="metaItem">
                            <span className="metaLabel">SHIP TO</span>
                            <span className="metaValue">
                              {order.shippingInfo?.city || user?.name}
                            </span>
                          </div>
                        </div>

                        <div className="headerRightGroup">
                          <span className="orderId">ID #{order._id}</span>
                          <Link
                            to={`/order/${order._id}`}
                            className="orderDetailBtn"
                          >
                            <span>Order Details</span>
                            <LaunchIcon />
                          </Link>
                        </div>
                      </div>

                      {/* Card Body - Lists ALL Items */}
                      <div className="orderCardBody">
                        <div className="statusBanner">
                          <span
                            className={`statusBadge ${
                              isDelivered ? "delivered" : "processing"
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                        </div>

                        <div className="itemsList">
                          {order.orderItems &&
                            order.orderItems.map((item, idx) => (
                              <div key={idx} className="orderItemRow">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="itemImage"
                                />
                                <div className="itemDetails">
                                  <Link
                                    to={`/product/${item.product}`}
                                    className="itemName"
                                  >
                                    {item.name}
                                  </Link>
                                  <div className="itemMeta">
                                    <span>Qty: {item.quantity}</span>
                                    <span>×</span>
                                    <span>₹{item.price.toLocaleString()}</span>
                                  </div>
                                </div>
                                <div className="itemPrice">
                                  ₹{(item.price * item.quantity).toLocaleString()}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="noOrders">
                <p>You haven't placed any orders yet.</p>
                <Link to="/products" className="shopNowBtn">
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default MyOrders;
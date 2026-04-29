import React from "react";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import "./orderSuccess.css";
import { Link } from "react-router-dom";
import MetaData from "../layout/MetaData";

const OrderSuccess = () => {
  return (
    <div className="orderSuccessWrapper">
      <MetaData title="Order Placed Successfully" />
      <div className="orderSuccessCard">
        <div className="iconContainer">
          <CheckCircleIcon />
        </div>

        <h2>Order Placed Successfully!</h2>
        <p>
          Thank you for your purchase. We're processing your order and will send
          you a confirmation email shortly.
        </p>

        <div className="actionButtons">
          <Link to="/orders" className="viewOrdersBtn">
            View My Orders
          </Link>
          <Link to="/products" className="continueBtn">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
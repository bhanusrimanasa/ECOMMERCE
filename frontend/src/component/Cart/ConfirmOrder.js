import React, { Fragment } from "react";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import "./ConfirmOrder.css";
import { Link, useNavigate } from "react-router-dom";

const ConfirmOrder = () => {
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const shippingCharges = subtotal > 1000 ? 0 : 200;
  const tax = subtotal * 0.18;
  const totalPrice = subtotal + tax + shippingCharges;

  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`;

  const proceedToPayment = () => {
    const data = {
      subtotal,
      shippingCharges,
      tax,
      totalPrice,
    };

    sessionStorage.setItem("orderInfo", JSON.stringify(data));
    navigate("/process/payment");
  };

  return (
    <Fragment>
      <MetaData title="Confirm Order" />
      <div className="confirmOrderWrapper">
        <CheckoutSteps activeStep={1} />

        <div className="confirmOrderPage">
          <div className="confirmOrderDetails">
            {/* Shipping Info Card */}
            <div className="sectionCard">
              <h3 className="sectionHeading">Shipping Info</h3>
              <div className="confirmshippingAreaBox">
                <div>
                  <p>Name</p>
                  <span>{user?.name}</span>
                </div>
                <div>
                  <p>Phone</p>
                  <span>{shippingInfo?.phoneNo}</span>
                </div>
                <div>
                  <p>Address</p>
                  <span>{address}</span>
                </div>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="sectionCard">
              <h3 className="sectionHeading">
                Your Cart Items <span>({cartItems.length})</span>
              </h3>
              <div className="confirmCartItemsContainer">
                {cartItems &&
                  cartItems.map((item) => (
                    <div key={item.product} className="cartItemRow">
                      <div className="itemMain">
                        <img src={item.image} alt={item.name} />
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </div>
                      <div className="itemCalculation">
                        <span>
                          {item.quantity} × ₹{item.price.toLocaleString()}
                        </span>
                        <b>₹{(item.price * item.quantity).toLocaleString()}</b>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="confirmOrderSummaryContainer">
            <div className="orderSummaryCard">
              <h3 className="sectionHeading centerText">Order Summary</h3>
              <div className="orderSummaryDetails">
                <div>
                  <p>Subtotal</p>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div>
                  <p>Shipping Charges</p>
                  <span>
                    {shippingCharges === 0 ? (
                      <em className="freeShipping">FREE</em>
                    ) : (
                      `₹${shippingCharges.toLocaleString()}`
                    )}
                  </span>
                </div>
                <div>
                  <p>GST (18%)</p>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="orderSummaryTotal">
                <p>Total Amount</p>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>

              <button className="paymentBtn" onClick={proceedToPayment}>
                Proceed To Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ConfirmOrder;
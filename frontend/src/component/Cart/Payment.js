import React, { Fragment, useEffect, useRef } from "react";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import axios from "axios";
import "./payment.css";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import EventIcon from "@material-ui/icons/Event";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import { createOrder, clearErrors } from "../../actions/orderAction";

const Payment = () => {
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

  const dispatch = useDispatch();
  const alert = useAlert();
  const stripe = useStripe();
  const elements = useElements();
  const payBtn = useRef(null);
  const navigate = useNavigate();

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.newOrder);

  const paymentData = {
    amount: orderInfo ? Math.round(orderInfo.totalPrice * 100) : 0,
  };

  const order = {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: orderInfo?.subtotal,
    taxPrice: orderInfo?.tax,
    shippingPrice: orderInfo?.shippingCharges,
    totalPrice: orderInfo?.totalPrice,
  };

  const stripeElementOptions = {
    style: {
      base: {
        fontSize: "15px",
        color: "#f8fafc",
        fontFamily: "'Roboto', sans-serif",
        "::placeholder": {
          color: "#64748b",
        },
      },
      invalid: {
        color: "#ef4444",
      },
    },
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (payBtn.current) payBtn.current.disabled = true;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/v1/payment/process",
        paymentData,
        config
      );

      const client_secret = data.client_secret;

      if (!stripe || !elements) return;

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user?.name,
            email: user?.email,
            address: {
              line1: shippingInfo?.address,
              city: shippingInfo?.city,
              state: shippingInfo?.state,
              postal_code: shippingInfo?.pinCode,
              country: shippingInfo?.country,
            },
          },
        },
      });

      if (result.error) {
        if (payBtn.current) payBtn.current.disabled = false;
        alert.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          };

          dispatch(createOrder(order));
          navigate("/success");
        } else {
          if (payBtn.current) payBtn.current.disabled = false;
          alert.error("There was an issue processing your payment");
        }
      }
    } catch (err) {
      if (payBtn.current) payBtn.current.disabled = false;
      alert.error(err.response?.data?.message || "Payment Process Error");
    }
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error, alert]);

  return (
    <Fragment>
      <MetaData title="Payment" />
      <div className="paymentWrapper">
        <CheckoutSteps activeStep={2} />

        <div className="paymentContainer">
          <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>
            <h3 className="paymentHeading">Card Information</h3>

            <div className="inputGroup">
              <CreditCardIcon />
              <CardNumberElement
                className="paymentInput"
                options={stripeElementOptions}
              />
            </div>

            <div className="inputRow">
              <div className="inputGroup">
                <EventIcon />
                <CardExpiryElement
                  className="paymentInput"
                  options={stripeElementOptions}
                />
              </div>

              <div className="inputGroup">
                <VpnKeyIcon />
                <CardCvcElement
                  className="paymentInput"
                  options={stripeElementOptions}
                />
              </div>
            </div>

            <input
              type="submit"
              value={`Pay ₹${orderInfo ? orderInfo.totalPrice.toLocaleString() : 0}`}
              ref={payBtn}
              className="paymentFormBtn"
            />
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Payment;
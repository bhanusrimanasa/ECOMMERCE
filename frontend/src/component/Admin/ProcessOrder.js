import React, { Fragment, useEffect, useState } from "react";
import MetaData from "../layout/MetaData";
import { Link, useParams } from "react-router-dom";
import { Typography, Button } from "@material-ui/core";
import SideBar from "./Sidebar";
import {
  getOrderDetails,
  clearErrors,
  updateOrder,
  assignDeliveryAgent,
} from "../../actions/orderAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import { UPDATE_ORDER_RESET, ASSIGN_AGENT_RESET } from "../../constants/orderConstants";
import axios from "axios";
import "./processOrder.css";

const ProcessOrder = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const alert = useAlert();

  const { order, error, loading } = useSelector((state) => state.orderDetails);
  const { error: updateError, isUpdated } = useSelector((state) => state.order);
  const { isAssigned, error: assignError, loading: assignLoading } = useSelector(
    (state) => state.deliveryProcess || {}
  );

  const [status, setStatus] = useState("");
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState("");

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const { data } = await axios.get("/api/v1/admin/users");
        const deliveryAgents = data.users?.filter((u) => u.role === "deliveryAgent") || [];
        setAgents(deliveryAgents);
      } catch (err) {
        console.error("Failed to fetch delivery agents", err);
      }
    };
    fetchAgents();
  }, []);

  useEffect(() => {
    if (order?.assignedAgent) {
      setSelectedAgent(order.assignedAgent._id || order.assignedAgent);
    }
  }, [order]);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }
    if (assignError) {
      alert.error(assignError);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      alert.success("Order Status Updated Successfully");
      dispatch({ type: UPDATE_ORDER_RESET });
    }
    if (isAssigned) {
      alert.success("Delivery Agent Assigned Successfully");
      dispatch({ type: ASSIGN_AGENT_RESET });
    }

    if (id) {
      dispatch(getOrderDetails(id));
    }
  }, [dispatch, alert, error, id, isUpdated, updateError, isAssigned, assignError]);

  const updateOrderSubmitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("status", status);
    dispatch(updateOrder(id, myForm));
  };

  const assignAgentSubmitHandler = (e) => {
    e.preventDefault();
    if (!selectedAgent) {
      return alert.error("Please select a delivery agent");
    }
    dispatch(assignDeliveryAgent(id, selectedAgent));
  };

  return (
    <Fragment>
      <MetaData title="Process Order" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">
          {loading || !order ? (
            <Loader />
          ) : (
            <div
              className="confirmOrderPage"
              style={{
                display: order.orderStatus === "Delivered" ? "block" : "grid",
              }}
            >
              <div>
                <div className="confirmshippingArea">
                  <Typography>Shipping Info</Typography>
                  <div className="orderDetailsContainerBox">
                    <div>
                      <p>Name:</p>
                      <span>{order.user?.name}</span>
                    </div>
                    <div>
                      <p>Phone:</p>
                      <span>{order.shippingInfo?.phoneNo}</span>
                    </div>
                    <div>
                      <p>Address:</p>
                      <span>
                        {order.shippingInfo &&
                          `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}
                      </span>
                    </div>
                  </div>

                  <Typography>Payment</Typography>
                  <div className="orderDetailsContainerBox">
                    <div>
                      <p
                        className={
                          order.paymentInfo?.status === "succeeded"
                            ? "greenColor"
                            : "redColor"
                        }
                      >
                        {order.paymentInfo?.status === "succeeded"
                          ? "PAID"
                          : "NOT PAID"}
                      </p>
                    </div>

                    <div>
                      <p>Amount:</p>
                      <span>₹{order.totalPrice?.toLocaleString()}</span>
                    </div>
                  </div>

                  <Typography>Order Status</Typography>
                  <div className="orderDetailsContainerBox">
                    <div>
                      <p
                        className={
                          order.orderStatus === "Delivered"
                            ? "greenColor"
                            : "redColor"
                        }
                      >
                        {order.orderStatus}
                      </p>
                    </div>
                    <div>
                      <p>Delivery Agent Status:</p>
                      <span>{order.deliveryStatus || "Not Assigned"}</span>
                    </div>
                    <div>
                      <p>Assigned Agent:</p>
                      <span>
                        {order.assignedAgent ? order.assignedAgent.name : "None"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="confirmCartItems">
                  <Typography>Your Cart Items:</Typography>
                  <div className="confirmCartItemsContainer">
                    {order.orderItems?.map((item) => (
                      <div key={item.product}>
                        <img src={item.image} alt="Product" />
                        <Link to={`/product/${item.product}`}>
                          {item.name}
                        </Link>{" "}
                        <span>
                          {item.quantity} X ₹{item.price} ={" "}
                          <b>₹{item.price * item.quantity}</b>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: order.orderStatus === "Delivered" ? "none" : "block",
                }}
              >
                <form
                  className="updateOrderForm"
                  onSubmit={assignAgentSubmitHandler}
                >
                  <h1>Assign Agent</h1>

                  <div>
                    <LocalShippingIcon />
                    <select
                      value={selectedAgent}
                      onChange={(e) => setSelectedAgent(e.target.value)}
                    >
                      <option value="">Choose Agent</option>
                      {agents.map((agent) => (
                        <option key={agent._id} value={agent._id}>
                          {agent.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button
                    id="createProductBtn"
                    type="submit"
                    disabled={assignLoading || selectedAgent === ""}
                  >
                    Assign
                  </Button>
                </form>

                <form
                  className="updateOrderForm"
                  onSubmit={updateOrderSubmitHandler}
                  style={{ marginTop: "2rem" }}
                >
                  <h1>Process Order</h1>

                  <div>
                    <AccountTreeIcon />
                    <select onChange={(e) => setStatus(e.target.value)}>
                      <option value="">Choose Status</option>
                      {order.orderStatus === "Processing" && (
                        <option value="Shipped">Shipped</option>
                      )}

                      {order.orderStatus === "Shipped" && (
                        <option value="Delivered">Delivered</option>
                      )}
                    </select>
                  </div>

                  <Button
                    id="createProductBtn"
                    type="submit"
                    disabled={loading || status === ""}
                  >
                    Process
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default ProcessOrder;
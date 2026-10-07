import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import {
  getAgentOrders,
  updateDeliveryStatus,
  clearErrors,
} from "../../actions/orderAction";
import { UPDATE_DELIVERY_RESET } from "../../constants/orderConstants";
import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";
import "./AgentDashboard.css";

const AgentDashboard = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { orders, loading, error } = useSelector((state) => state.agentOrders);
  const { isUpdated, error: updateError, loading: updateLoading } = useSelector(
    (state) => state.deliveryProcess || {}
  );

  const [statusMap, setStatusMap] = useState({});
  const [notesMap, setNotesMap] = useState({});

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("Delivery status updated successfully!");
      dispatch({ type: UPDATE_DELIVERY_RESET });
      dispatch(getAgentOrders());
    } else {
      dispatch(getAgentOrders());
    }
  }, [dispatch, alert, error, updateError, isUpdated]);

  const handleStatusChange = (orderId, value) => {
    setStatusMap((prev) => ({ ...prev, [orderId]: value }));
  };

  const handleNotesChange = (orderId, value) => {
    setNotesMap((prev) => ({ ...prev, [orderId]: value }));
  };

  const handleUpdate = (orderId) => {
    const deliveryStatus = statusMap[orderId] || "Out for Delivery";
    const deliveryNotes = notesMap[orderId] || "";

    dispatch(
      updateDeliveryStatus(orderId, {
        deliveryStatus,
        deliveryNotes,
      })
    );
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="agentDashboardContainer">
      <MetaData title="Delivery Agent Portal" />
      <h2>🚚 Delivery Agent Portal</h2>
      <p className="subtitle">Manage and update your assigned deliveries</p>

      {orders && orders.length === 0 ? (
        <div className="noOrdersBox">
          <p>No delivery tasks assigned to you at the moment.</p>
        </div>
      ) : (
        <div className="ordersGrid">
          {orders &&
            orders.map((order) => (
              <div key={order._id} className="agentOrderCard">
                <div className="cardHeader">
                  <span className="orderId">Order #{order._id}</span>
                  <span
                    className={`statusTag ${
                      order.deliveryStatus
                        ? order.deliveryStatus.toLowerCase().replace(/\s+/g, "-")
                        : "assigned"
                    }`}
                  >
                    {order.deliveryStatus || "Assigned"}
                  </span>
                </div>

                <div className="cardBody">
                  <p>
                    <strong>Customer:</strong> {order.user?.name || "N/A"}
                  </p>
                  <p>
                    <strong>Email:</strong> {order.user?.email || "N/A"}
                  </p>
                  <p>
                    <strong>Phone:</strong> {order.shippingInfo?.phoneNo || "N/A"}
                  </p>
                  <p>
                    <strong>Address:</strong> {order.shippingInfo?.address},{" "}
                    {order.shippingInfo?.city}, {order.shippingInfo?.state} -{" "}
                    {order.shippingInfo?.pinCode}
                  </p>
                  <p>
                    <strong>Total Amount:</strong> ₹
                    {order.totalPrice ? order.totalPrice.toLocaleString() : 0}
                  </p>
                  {order.deliveryNotes && (
                    <p className="existingNotes">
                      <strong>Current Note:</strong> {order.deliveryNotes}
                    </p>
                  )}
                </div>

                <div className="cardControls">
                  <label>Update Status:</label>
                  <select
                    value={
                      statusMap[order._id] !== undefined
                        ? statusMap[order._id]
                        : order.deliveryStatus || "Assigned"
                    }
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                  >
                    <option value="Assigned">Assigned</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Failed">Failed</option>
                  </select>

                  <label>Delivery Note:</label>
                  <input
                    type="text"
                    placeholder="e.g. Left with neighbor / Security"
                    value={notesMap[order._id] || ""}
                    onChange={(e) =>
                      handleNotesChange(order._id, e.target.value)
                    }
                  />

                  <button
                    disabled={updateLoading}
                    onClick={() => handleUpdate(order._id)}
                  >
                    {updateLoading ? "Updating..." : "Save Progress"}
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;
import {
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAIL,
  MY_ORDERS_REQUEST,
  MY_ORDERS_SUCCESS,
  MY_ORDERS_FAIL,
  ALL_ORDERS_REQUEST,
  ALL_ORDERS_SUCCESS,
  ALL_ORDERS_FAIL,
  UPDATE_ORDER_REQUEST,
  UPDATE_ORDER_SUCCESS,
  UPDATE_ORDER_FAIL,
  DELETE_ORDER_REQUEST,
  DELETE_ORDER_SUCCESS,
  DELETE_ORDER_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  ASSIGN_AGENT_REQUEST,
  ASSIGN_AGENT_SUCCESS,
  ASSIGN_AGENT_FAIL,
  MY_DELIVERIES_REQUEST,
  MY_DELIVERIES_SUCCESS,
  MY_DELIVERIES_FAIL,
  UPDATE_DELIVERY_REQUEST,
  UPDATE_DELIVERY_SUCCESS,
  UPDATE_DELIVERY_FAIL,
  RETURN_ORDER_REQUEST,
  RETURN_ORDER_SUCCESS,
  RETURN_ORDER_FAIL,
  UPDATE_RETURN_STATUS_REQUEST,
  UPDATE_RETURN_STATUS_SUCCESS,
  UPDATE_RETURN_STATUS_FAIL,
  CLEAR_ERRORS,
} from "../constants/orderConstants";

import axios from "axios";

// Create Order
export const createOrder = (order) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_ORDER_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post("/api/v1/order/new", order, config);

    dispatch({ type: CREATE_ORDER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CREATE_ORDER_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// My Orders
export const myOrders = () => async (dispatch) => {
  try {
    dispatch({ type: MY_ORDERS_REQUEST });

    const { data } = await axios.get("/api/v1/orders/me");

    dispatch({ type: MY_ORDERS_SUCCESS, payload: data.orders });
  } catch (error) {
    dispatch({
      type: MY_ORDERS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get All Orders (admin)
export const getAllOrders = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_ORDERS_REQUEST });

    const { data } = await axios.get("/api/v1/admin/orders");

    dispatch({ type: ALL_ORDERS_SUCCESS, payload: data.orders });
  } catch (error) {
    dispatch({
      type: ALL_ORDERS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Update Order
export const updateOrder = (id, order) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_ORDER_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.put(
      `/api/v1/admin/order/${id}`,
      order,
      config
    );

    dispatch({ type: UPDATE_ORDER_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: UPDATE_ORDER_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Delete Order
export const deleteOrder = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_ORDER_REQUEST });

    const { data } = await axios.delete(`/api/v1/admin/order/${id}`);

    dispatch({ type: DELETE_ORDER_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: DELETE_ORDER_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get Order Details
export const getOrderDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: ORDER_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/v1/order/${id}`);

    dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data.order });
  } catch (error) {
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Assign Delivery Agent -- Admin
export const assignDeliveryAgent = (id, agentId) => async (dispatch) => {
  try {
    dispatch({ type: ASSIGN_AGENT_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.put(
      `/api/v1/admin/order/assign/${id}`,
      { agentId },
      config
    );

    dispatch({ type: ASSIGN_AGENT_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: ASSIGN_AGENT_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get Agent Assigned Orders -- Delivery Agent
export const getAgentOrders = () => async (dispatch) => {
  try {
    dispatch({ type: MY_DELIVERIES_REQUEST });

    const { data } = await axios.get("/api/v1/agent/orders");

    dispatch({ type: MY_DELIVERIES_SUCCESS, payload: data.orders });
  } catch (error) {
    dispatch({
      type: MY_DELIVERIES_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Update Delivery Progress & Notes -- Delivery Agent
export const updateDeliveryStatus = (id, deliveryData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_DELIVERY_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.put(
      `/api/v1/agent/order/${id}`,
      deliveryData,
      config
    );

    dispatch({ type: UPDATE_DELIVERY_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: UPDATE_DELIVERY_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Request Order Return -- Customer
export const requestReturnOrder = (id, reason) => async (dispatch) => {
  try {
    dispatch({ type: RETURN_ORDER_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.put(
      `/api/v1/order/return/${id}`,
      { reason },
      config
    );

    dispatch({ type: RETURN_ORDER_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: RETURN_ORDER_FAIL,
     payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};

// Update Return Status -- Admin
export const updateReturnStatus = (id, statusData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_RETURN_STATUS_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.put(
      `/api/v1/admin/order/return/${id}`,
      statusData,
      config
    );

    dispatch({ type: UPDATE_RETURN_STATUS_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: UPDATE_RETURN_STATUS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Clearing Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
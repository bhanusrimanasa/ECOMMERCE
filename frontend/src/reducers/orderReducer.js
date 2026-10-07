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
  UPDATE_ORDER_RESET,
  UPDATE_ORDER_FAIL,
  DELETE_ORDER_REQUEST,
  DELETE_ORDER_SUCCESS,
  DELETE_ORDER_RESET,
  DELETE_ORDER_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  ASSIGN_AGENT_REQUEST,
  ASSIGN_AGENT_SUCCESS,
  ASSIGN_AGENT_RESET,
  ASSIGN_AGENT_FAIL,
  MY_DELIVERIES_REQUEST,
  MY_DELIVERIES_SUCCESS,
  MY_DELIVERIES_FAIL,
  UPDATE_DELIVERY_REQUEST,
  UPDATE_DELIVERY_SUCCESS,
  UPDATE_DELIVERY_RESET,
  UPDATE_DELIVERY_FAIL,
  RETURN_ORDER_REQUEST,
  RETURN_ORDER_SUCCESS,
  RETURN_ORDER_FAIL,
  RETURN_ORDER_RESET,
  CLEAR_ERRORS,
} from "../constants/orderConstants";

// Create Order Reducer
export const newOrderReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_ORDER_REQUEST:
      return { ...state, loading: true };
    case CREATE_ORDER_SUCCESS:
      return { loading: false, order: action.payload };
    case CREATE_ORDER_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

// Logged In Customer Orders Reducer
export const myOrdersReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case MY_ORDERS_REQUEST:
      return { loading: true };
    case MY_ORDERS_SUCCESS:
      return { loading: false, orders: action.payload };
    case MY_ORDERS_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};
export const returnOrderReducer = (state = {}, action) => {
  switch (action.type) {
    case RETURN_ORDER_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case RETURN_ORDER_SUCCESS:
      return {
        loading: false,
        isReturned: action.payload,
      };
    case RETURN_ORDER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case RETURN_ORDER_RESET:
      return {
        ...state,
        isReturned: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// All Orders Reducer (Admin)
export const allOrdersReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case ALL_ORDERS_REQUEST:
      return { loading: true };
    case ALL_ORDERS_SUCCESS:
      return { loading: false, orders: action.payload };
    case ALL_ORDERS_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

// Order Admin Operations (Update / Delete)
export const orderReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_ORDER_REQUEST:
    case DELETE_ORDER_REQUEST:
      return { ...state, loading: true };
    case UPDATE_ORDER_SUCCESS:
      return { ...state, loading: false, isUpdated: action.payload };
    case DELETE_ORDER_SUCCESS:
      return { ...state, loading: false, isDeleted: action.payload };
    case UPDATE_ORDER_FAIL:
    case DELETE_ORDER_FAIL:
      return { ...state, loading: false, error: action.payload };
    case UPDATE_ORDER_RESET:
      return { ...state, isUpdated: false };
    case DELETE_ORDER_RESET:
      return { ...state, isDeleted: false };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

// Order Details Reducer
export const orderDetailsReducer = (state = { order: {} }, action) => {
  switch (action.type) {
    case ORDER_DETAILS_REQUEST:
      return { loading: true };
    case ORDER_DETAILS_SUCCESS:
      return { loading: false, order: action.payload };
    case ORDER_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

// Delivery Agent Assigned Deliveries Reducer
export const agentOrdersReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case MY_DELIVERIES_REQUEST:
      return { loading: true, orders: [] };
    case MY_DELIVERIES_SUCCESS:
      return { loading: false, orders: action.payload };
    case MY_DELIVERIES_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

// Delivery Process / Assign Agent Reducer
export const deliveryProcessReducer = (state = {}, action) => {
  switch (action.type) {
    case ASSIGN_AGENT_REQUEST:
    case UPDATE_DELIVERY_REQUEST:
      return { ...state, loading: true };
    case ASSIGN_AGENT_SUCCESS:
      return { ...state, loading: false, isAssigned: action.payload };
    case UPDATE_DELIVERY_SUCCESS:
      return { ...state, loading: false, isUpdated: action.payload };
    case ASSIGN_AGENT_FAIL:
    case UPDATE_DELIVERY_FAIL:
      return { ...state, loading: false, error: action.payload };
    case ASSIGN_AGENT_RESET:
      return { ...state, isAssigned: false };
    case UPDATE_DELIVERY_RESET:
      return { ...state, isUpdated: false };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};
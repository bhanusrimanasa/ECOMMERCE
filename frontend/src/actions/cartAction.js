import {
  ADD_TO_CART,
  REMOVE_CART_ITEM,
  SAVE_SHIPPING_INFO,
} from "../constants/cartConstants";
import axios from "axios";

// Add to Cart
export const addItemsToCart = (id, quantity) => async (dispatch, getState) => {
  const { data } = await axios.get(`/api/v1/product/${id}`);

  dispatch({
    type: ADD_TO_CART,
    payload: {
      product: data.product._id,
      name: data.product.name,
      price: data.product.price,
      image: data.product.images[0].url,
      stock: data.product.Stock,
      quantity,
    },
  });

  const { cartItems } = getState().cart;

  // Sync updated cart state directly to MongoDB
  try {
    await axios.put(
      `/api/v1/cart/update`,
      { cartItems },
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Failed to sync cart to database:", error);
  }

  localStorage.setItem("cartItems", JSON.stringify(cartItems));
};

// REMOVE FROM CART
export const removeItemsFromCart = (id) => async (dispatch, getState) => {
  dispatch({
    type: REMOVE_CART_ITEM,
    payload: id,
  });

  const { cartItems } = getState().cart;

  // Sync updated cart state directly to MongoDB
  try {
    await axios.put(
      `/api/v1/cart/update`,
      { cartItems },
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Failed to sync cart to database:", error);
  }

  localStorage.setItem("cartItems", JSON.stringify(cartItems));
};

// SAVE SHIPPING INFO
export const saveShippingInfo = (data) => async (dispatch) => {
  dispatch({
    type: SAVE_SHIPPING_INFO,
    payload: data,
  });

  // Sync shipping info directly to MongoDB
  try {
    await axios.put(
      `/api/v1/shipping/update`,
      { shippingInfo: data },
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Failed to sync shipping info to database:", error);
  }

  localStorage.setItem("shippingInfo", JSON.stringify(data));
};
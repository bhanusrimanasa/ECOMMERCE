import {
  ADD_TO_CART,
  REMOVE_CART_ITEM,
  SAVE_SHIPPING_INFO,
} from "../constants/cartConstants";
import {
  LOAD_USER_SUCCESS,
  LOGIN_SUCCESS,
  REGISTER_USER_SUCCESS,
  LOGOUT_SUCCESS,
} from "../constants/userConstants";

export const cartReducer = (
  state = { cartItems: [], shippingInfo: {} },
  action
) => {
  switch (action.type) {
    case ADD_TO_CART:
      const item = action.payload;

      const isItemExist = state.cartItems.find(
        (i) => i.product === item.product
      );

      if (isItemExist) {
        return {
          ...state,
          cartItems: state.cartItems.map((i) =>
            i.product === isItemExist.product ? item : i
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }

    case REMOVE_CART_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter((i) => i.product !== action.payload),
      };

    case SAVE_SHIPPING_INFO:
      return {
        ...state,
        shippingInfo: action.payload,
      };

    // Hydrate cart items & shipping info from MongoDB when user logs in or loads profile
    case LOAD_USER_SUCCESS:
    case LOGIN_SUCCESS:
    case REGISTER_USER_SUCCESS:
      return {
        ...state,
        cartItems: action.payload.cartItems || [],
        shippingInfo: action.payload.shippingInfo || {},
      };

    // Completely flush cart items and shipping info from Redux on logout
    case LOGOUT_SUCCESS:
      return {
        ...state,
        cartItems: [],
        shippingInfo: {},
      };

    default:
      return state;
  }
};
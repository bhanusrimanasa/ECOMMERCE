const express = require("express");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  assignDeliveryAgent,
  getAgentOrders,
  updateDeliveryStatus,
  updateOrder,
  deleteOrder,
  requestReturnOrder,
  updateReturnStatus,
} = require("../controllers/orderController");

const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

// ==========================================
// CUSTOMER ROUTES
// ==========================================
router.route("/order/new").post(isAuthenticatedUser, newOrder);
router.route("/orders/me").get(isAuthenticatedUser, myOrders);
router.route("/order/return/:id").put(isAuthenticatedUser, requestReturnOrder);
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);
router
  .route("/agent/orders")
  .get(isAuthenticatedUser, authorizeRoles("deliveryAgent"), getAgentOrders);

router
  .route("/agent/order/:id")
  .put(isAuthenticatedUser, authorizeRoles("deliveryAgent"), updateDeliveryStatus);
router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

router
  .route("/admin/order/assign/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), assignDeliveryAgent);

router
  .route("/admin/order/return/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateReturnStatus);

router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create New Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

// Get Single Order Details
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// Get Logged In User Orders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

// Get All Orders -- Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// Assign Delivery Agent -- Admin
exports.assignDeliveryAgent = catchAsyncErrors(async (req, res, next) => {
  const { agentId } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  order.assignedAgent = agentId;
  order.deliveryStatus = "Assigned";
  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Delivery agent assigned successfully",
    order,
  });
});

// Get Orders Assigned to Agent -- Delivery Agent
exports.getAgentOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ assignedAgent: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

// Update Delivery Status -- Delivery Agent
exports.updateDeliveryStatus = catchAsyncErrors(async (req, res, next) => {
  const { deliveryStatus, deliveryNotes } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  order.deliveryStatus = deliveryStatus;
  if (deliveryNotes) order.deliveryNotes = deliveryNotes;

  if (deliveryStatus === "Delivered") {
    order.orderStatus = "Delivered";
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Delivery status updated successfully",
    order,
  });
});

// Update Order Status -- Admin
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHander("You have already delivered this order", 400));
  }

  if (req.body.status === "Delivered") {
    for (const item of order.orderItems) {
      await updateStock(item.product, item.quantity);
    }
    order.deliveredAt = Date.now();
  }

  order.orderStatus = req.body.status;

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    order,
  });
});

// Helper Function: Decrease Stock on Order Delivery
async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  if (product) {
    product.Stock -= quantity;
    await product.save({ validateBeforeSave: false });
  }
}

// Delete Order -- Admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
  });
});

// Request Order Return -- Customer
exports.requestReturnOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  if (order.orderStatus !== "Delivered") {
    return next(new ErrorHander("You can only return delivered orders", 400));
  }

  order.returnStatus = "Requested";
  order.returnReason = req.body.reason;

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Return request submitted successfully",
  });
});

// Process Return & Restock Inventory -- Admin
exports.updateReturnStatus = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  if (order.returnStatus === "Returned") {
    return next(
      new ErrorHander("This order has already been returned and refunded", 400)
    );
  }

  const { status, adminNotes } = req.body;

  if (!["Returned", "Return Rejected"].includes(status)) {
    return next(new ErrorHander("Invalid return status provided", 400));
  }

  if (status === "Returned") {
    for (const item of order.orderItems) {
      await updateStockOnReturn(item.product, item.quantity);
    }
  }

  order.returnStatus = status;
  if (adminNotes) {
    order.deliveryNotes = adminNotes;
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: `Return status updated to ${status}`,
    order,
  });
});

// Helper Function: Increase Stock on Return Approval
async function updateStockOnReturn(productId, quantity) {
  const product = await Product.findById(productId);

  if (product) {
    product.Stock += quantity;
    await product.save({ validateBeforeSave: false });
  }
}
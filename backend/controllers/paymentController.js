const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHander = require("../utils/errorhander");

const getStripeInstance = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is missing from environment variables");
  }
  return require("stripe")(secretKey);
};

exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  const stripe = getStripeInstance();

  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    metadata: {
      company: "Ecommerce",
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res
    .status(200)
    .json({ success: true, client_secret: myPayment.client_secret });
});

exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
  const apiKey = process.env.STRIPE_API_KEY || "";

  res.status(200).json({ stripeApiKey: apiKey });
});
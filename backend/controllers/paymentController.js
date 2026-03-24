const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Initialize stripe inside a getter or safely fallback to avoid crashing on startup if env isn't loaded yet
const getStripeInstance = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    // If you haven't fixed your config.env yet, you can temporarily paste your "sk_test_..." key here
    return require("stripe")("your_temporary_stripe_secret_key_here");
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
    // Modern stripe packages automatically use the latest API version, 
    // but specifying automatic payment methods ensures compatibility with modern frontend configurations
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res
    .status(200)
    .json({ success: true, client_secret: myPayment.client_secret });
});

exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
  // Safe fallback check if the frontend requests the publishable key before config loads
  const apiKey = process.env.STRIPE_API_KEY || "your_temporary_stripe_publishable_key_here";
  
  res.status(200).json({ stripeApiKey: apiKey });
});
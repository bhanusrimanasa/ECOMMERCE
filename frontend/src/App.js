import "./App.css";
import React, { useEffect, useState, useMemo } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WebFont from "webfontloader";
import { useSelector } from "react-redux";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import store from "./store";
import { loadUser } from "./actions/userAction";

// Layout & Common Components
import Header from "./component/layout/Header/Header";
import Footer from "./component/layout/Footer/Footer";
import UserOptions from "./component/layout/Header/UserOptions";
import Contact from "./component/layout/Contact/Contact";
import About from "./component/layout/About/About";
import NotFound from "./component/layout/Not Found/NotFound";
import PolicyPage from "./component/layout/Footer/PolicyPage";

// Product Components
import Home from "./component/Home/Home";
import ProductDetails from "./component/Product/ProductDetails";
import Products from "./component/Product/Products";
import Search from "./component/Product/Search";

// User & Auth Components
import LoginSignUp from "./component/User/LoginSignUp";
import Profile from "./component/User/Profile";
import ProtectedRoute from "./component/Route/ProtectedRoute";
import UpdateProfile from "./component/User/UpdateProfile";
import UpdatePassword from "./component/User/UpdatePassword";
import ForgotPassword from "./component/User/ForgotPassword";
import ResetPassword from "./component/User/ResetPassword";

// Cart & Checkout Components
import Cart from "./component/Cart/Cart";
import Shipping from "./component/Cart/Shipping";
import ConfirmOrder from "./component/Cart/ConfirmOrder";
import Payment from "./component/Cart/Payment";
import OrderSuccess from "./component/Cart/OrderSuccess";
import MyOrders from "./component/Order/MyOrders";
import OrderDetails from "./component/Order/OrderDetails";

// Dashboard Components (Admin & Agent)
import Dashboard from "./component/Admin/Dashboard";
import AgentDashboard from "./component/Agent/AgentDashboard";
import ProductList from "./component/Admin/ProductList";
import NewProduct from "./component/Admin/NewProduct";
import UpdateProduct from "./component/Admin/UpdateProduct";
import OrderList from "./component/Admin/OrderList";
import ProcessOrder from "./component/Admin/ProcessOrder";
import UsersList from "./component/Admin/UsersList";
import UpdateUser from "./component/Admin/UpdateUser";
import ProductReviews from "./component/Admin/ProductReviews";
import CategoryList from "./component/Admin/CategoryList";

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [stripeApiKey, setStripeApiKey] = useState("");

  // Load Stripe Key when Authenticated
  useEffect(() => {
    async function getStripeApiKey() {
      try {
        const { data } = await axios.get("/api/v1/stripeapikey");
        setStripeApiKey(data.stripeApiKey);
      } catch (error) {
        console.warn("Stripe key fetch skipped: User not logged in yet.");
      }
    }

    if (isAuthenticated) {
      getStripeApiKey();
    }
  }, [isAuthenticated]);

  // Load Fonts & Authenticate User on Mount
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    store.dispatch(loadUser());

    // Context Menu Handler
    const handleContextMenu = (e) => e.preventDefault();
    window.addEventListener("contextmenu", handleContextMenu);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  // Memoize Stripe Loader Promise
  const stripePromise = useMemo(() => {
    return stripeApiKey ? loadStripe(stripeApiKey) : null;
  }, [stripeApiKey]);

  return (
    <Router>
      <Header />

      {isAuthenticated && <UserOptions user={user} />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/search" element={<Search />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<LoginSignUp />} />

        {/* User Account Protected Routes */}
        <Route path="/account" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/me/update" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
        <Route path="/password/update" element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/cart" element={<Cart />} />

        {/* Checkout Protected Routes */}
        <Route path="/shipping" element={<ProtectedRoute><Shipping /></ProtectedRoute>} />
        <Route path="/order/confirm" element={<ProtectedRoute><ConfirmOrder /></ProtectedRoute>} />
        <Route path="/success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
        <Route path="/order/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />

        {/* Payment Gateway Route */}
        {stripeApiKey && stripePromise && (
          <Route
            path="/process/payment"
            element={
              <Elements stripe={stripePromise}>
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              </Elements>
            }
          />
        )}

        {/* Delivery Agent Control Panel */}
        <Route
          path="/agent/dashboard"
          element={
            <ProtectedRoute isAgent={true}>
              <AgentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Control Panels */}
        <Route path="/admin/dashboard" element={<ProtectedRoute isAdmin={true}><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute isAdmin={true}><ProductList /></ProtectedRoute>} />
        <Route path="/admin/product" element={<ProtectedRoute isAdmin={true}><NewProduct /></ProtectedRoute>} />
        <Route path="/admin/product/:id" element={<ProtectedRoute isAdmin={true}><UpdateProduct /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute isAdmin={true}><OrderList /></ProtectedRoute>} />
        <Route path="/admin/order/:id" element={<ProtectedRoute isAdmin={true}><ProcessOrder /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute isAdmin={true}><UsersList /></ProtectedRoute>} />
        <Route path="/admin/user/:id" element={<ProtectedRoute isAdmin={true}><UpdateUser /></ProtectedRoute>} />
        <Route path="/admin/reviews" element={<ProtectedRoute isAdmin={true}><ProductReviews /></ProtectedRoute>} />
        <Route path="/admin/categories" element={<ProtectedRoute isAdmin={true}><CategoryList /></ProtectedRoute>} />

        {/* Footer Policy Routes */}
        <Route path="/shipping-policy" element={<PolicyPage page="shipping-policy" />} />
        <Route path="/returns" element={<PolicyPage page="returns" />} />
        <Route path="/privacy" element={<PolicyPage page="privacy" />} />
        <Route path="/faq" element={<PolicyPage page="faq" />} />

        {/* 404 Catch-All Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
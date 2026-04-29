import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footerContainer">
      {/* Top Section: Clear Operational Columns */}
      <div className="footerTop">
        <div className="footerCol">
          <h3>Get to Know Us</h3>
          <ul>
            <li><Link to="/about">About Our Store</Link></li>
            <li><Link to="/contact">Contact Support</Link></li>
            <li><Link to="/faq">Frequently Asked Questions</Link></li>
          </ul>
        </div>

        <div className="footerCol">
          <h3>Customer Service</h3>
          <ul>
            <li><Link to="/account">Your Account</Link></li>
            <li><Link to="/orders">Your Orders</Link></li>
            <li><Link to="/cart">View Shopping Cart</Link></li>
          </ul>
        </div>

        <div className="footerCol">
          <h3>Policies & Trust</h3>
          <ul>
            <li><Link to="/shipping-policy">Shipping & Delivery Rates</Link></li>
            <li><Link to="/returns">Returns & Replacements</Link></li>
            <li><Link to="/privacy">Privacy Notice & Security</Link></li>
          </ul>
        </div>

        <div className="footerCol">
          <h3>Secure Ecosystem</h3>
          <p className="securityText">
            Payments are processed securely via Stripe. Your card information is fully encrypted and never stored on our servers.
          </p>
        </div>
      </div>

      <hr className="footerDivider" />

      {/* Bottom Section: Branding and Timestamp */}
      <div className="footerBottom">
        <div className="footerBrand">
          <h2>MOCKMARKET</h2>
          <p>© {new Date().getFullYear()} MockMarket Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
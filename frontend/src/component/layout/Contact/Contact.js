import React, { useState } from "react";
import "./Contact.css";
import Button from "@material-ui/core/Button";

const Contact = () => {
  const [copied, setCopied] = useState(false);
  const emailAddress = "support@mockmarket.com";
  
  const emailSubject = encodeURIComponent("Support Inquiry - MockMarket");
  const emailBody = encodeURIComponent(
    "Hello Support Team,\n\nI have a question regarding...\n\n[Please write your message here]"
  );
  const mailtoString = `mailto:${emailAddress}?subject=${emailSubject}&body=${emailBody}`;

  // Fallback function: Copies email to clipboard if standard mailto fails
  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000); // Reset alert text after 3 seconds
  };

  return (
    <div className="contactContainer">
      <div className="contactBox">
        <h1>Contact Us</h1>
        <div className="contactDivider"></div>
        <p>Have a question about an order, shipping parameters, or our AI Assistant?</p>
        <p>We are here to help you 24/7!</p>

        <div className="contactDetails">
          <div className="detailItem">
            <strong>📍 Address:</strong> Meghalaya, India
          </div>
          <div className="detailItem">
            <strong>📞 Phone:</strong> +91 6303823149
          </div>
          <div className="detailItem">
            <strong>📧 Support Email:</strong> {emailAddress}
          </div>
        </div>

        <div className="contactActions">
          {/* Main system action button */}
          <a className="mailBtn" href={mailtoString}>
            <Button variant="contained">Send Us An Email</Button>
          </a>

          {/* Backup Action Trigger */}
          <button className="copyEmailBtn" onClick={copyEmailToClipboard}>
            {copied ? "✓ Copied to Clipboard!" : "Copy Email Address"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
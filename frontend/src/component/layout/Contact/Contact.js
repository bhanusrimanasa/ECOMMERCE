import React, { useState } from "react";
import "./Contact.css";
import Button from "@material-ui/core/Button";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import PhoneIcon from "@material-ui/icons/Phone";
import EmailIcon from "@material-ui/icons/Email";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import CheckIcon from "@material-ui/icons/Check";

const Contact = () => {
  const [copied, setCopied] = useState(false);
  const emailAddress = "support@mockmarket.com";
  
  const emailSubject = encodeURIComponent("Support Inquiry - MockMarket");
  const emailBody = encodeURIComponent(
    "Hello Support Team,\n\nI have a question regarding...\n\n[Please write your message here]"
  );
  const mailtoString = `mailto:${emailAddress}?subject=${emailSubject}&body=${emailBody}`;

  // Copy email to clipboard fallback
  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="contactContainer">
      <div className="contactBox">
        <h1>Contact Us</h1>
        <div className="contactDivider"></div>
        <p className="contactSubtitle">
          Have a question about an order, shipping parameters, or our AI Assistant?
        </p>
        <p className="contactHighlight">We are here to help you 24/7!</p>

        <div className="contactDetails">
          <div className="detailItem">
            <LocationOnIcon className="detailIcon" />
            <span><strong>Address:</strong> Meghalaya, India</span>
          </div>
          <div className="detailItem">
            <PhoneIcon className="detailIcon" />
            <span><strong>Phone:</strong> +91 6303823149</span>
          </div>
          <div className="detailItem">
            <EmailIcon className="detailIcon" />
            <span><strong>Support Email:</strong> {emailAddress}</span>
          </div>
        </div>

        <div className="contactActions">
          <a className="mailBtn" href={mailtoString}>
            <Button variant="contained">Send Us An Email</Button>
          </a>

          <button className="copyEmailBtn" onClick={copyEmailToClipboard}>
            {copied ? (
              <>
                <CheckIcon style={{ fontSize: 16 }} /> Copied to Clipboard!
              </>
            ) : (
              <>
                <FileCopyIcon style={{ fontSize: 16 }} /> Copy Email Address
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
import React from "react";
import "./aboutSection.css";
import { Button } from "@material-ui/core";
import GitHubIcon from "@material-ui/icons/GitHub";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import EmailIcon from "@material-ui/icons/Email";
import PhoneIcon from "@material-ui/icons/Phone";

const About = () => {
  const visitGitHub = () => {
    window.open("https://github.com/bhanusrimanasa", "_blank");
  };

  return (
    <div className="aboutSection">
      <div className="aboutSectionContainer">
        <h1>About Us</h1>
        <div className="aboutDivider"></div>

        <div className="aboutCardGrid">
          {/* Main Info Card */}
          <div className="aboutMainCard">
            <h2>Mudhivarthi Bhanu Sri Manasa</h2>
            
            <div className="contactMeta">
              <span><EmailIcon className="metaIcon" /> bhanusrimanasa@gmail.com</span>
              <span><PhoneIcon className="metaIcon" /> +91 6303823149</span>
            </div>

            <Button onClick={visitGitHub} className="githubBtn">
              <GitHubIcon style={{ fontSize: 18 }} /> Visit GitHub
            </Button>
            
            <p className="aboutDescription">
              Welcome to <strong>MockMarket</strong>, a full-stack e-commerce application built using 
              React, Redux, Node.js, Express, and MongoDB. Designed with secure JWT 
              authentication, payment gateway integrations, and responsive UI layouts.
            </p>
          </div>

          {/* Social Links Card */}
          <div className="aboutSocialCard">
            <h3>Connect With Us</h3>
            <div className="socialIconsGroup">
              <a
                href="https://github.com/bhanusrimanasa"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub Profile"
                className="socialLink github"
              >
                <GitHubIcon />
              </a>

              <a 
                href="https://linkedin.com" 
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn Profile"
                className="socialLink linkedin"
              >
                <LinkedInIcon />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
import React from "react";
import "./aboutSection.css";
import { Button, Typography } from "@material-ui/core";
import GitHubIcon from "@material-ui/icons/GitHub";
import LinkedInIcon from "@material-ui/icons/LinkedIn";

const About = () => {
  const visitGitHub = () => {
    window.location = "https://github.com";
  };

  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Typography variant="h5" style={{ marginTop: "1vmax" }}>
              Mudhivarthi Bhanu Sri Manasa
            </Typography>
            
            <Typography variant="subtitle1" style={{ color: "rgba(255, 255, 255, 0.8)", margin: "0.5vmax 0" }}>
              📧 bhanusrimanasa@gmail.com | 📞 +91 6303823149
            </Typography>

            <Button onClick={visitGitHub} color="primary" style={{ margin: "1vmax 0" }}>
              Visit GitHub
            </Button>
            
            <span>
              Welcome to MockMarket, a full-stack e-commerce application built using 
              React, Redux, Node.js, Express, and MongoDB. Designed with secure JWT 
              authentication, payment gateway integrations, and responsive UI layouts.
            </span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">Connect With Us</Typography>
            <a
              href="https://github.com/bhanusrimanasa"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubIcon className="githubSvgIcon" />
            </a>

            <a 
              href="https://linkedin.com" 
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedInIcon className="linkedinSvgIcon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
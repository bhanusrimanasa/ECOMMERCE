import React from "react";
import { Rating } from "@material-ui/lab";
import profilePng from "../../images/Profile.png";
import "./ReviewCard.css";

const ReviewCard = ({ review }) => {
  const options = {
    value: review.rating,
    readOnly: true,
    precision: 0.5,
  };

  return (
    <div className="reviewCard">
      <div className="reviewCardHeader">
        <div className="avatarWrapper">
          <img src={profilePng} alt={review.name} />
        </div>
        <div className="reviewUserInfo">
          <p className="reviewUserName">{review.name}</p>
          <Rating {...options} className="reviewRating" />
        </div>
      </div>
      <p className="reviewCardComment">{review.comment}</p>
    </div>
  );
};

export default ReviewCard;
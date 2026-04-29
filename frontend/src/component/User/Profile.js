import React, { Fragment, useEffect } from "react";
import { useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";
import { Link, useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/login");
    }
  }, [navigate, isAuthenticated]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={`${user?.name || "User"}'s Profile`} />
          <div className="profileContainer">
            {/* Left Side: Avatar & Edit Button */}
            <div className="profileLeft">
              <h1>My Profile</h1>
              <img
                src={user?.avatar?.url || "/Profile.png"}
                alt={user?.name || "User"}
              />
              <Link to="/me/update">Edit Profile</Link>
            </div>

            {/* Right Side: Account Info & Action Links */}
            <div className="profileRight">
              <div className="infoBlock">
                <h4>Full Name</h4>
                <p>{user?.name}</p>
              </div>

              <div className="infoBlock">
                <h4>Email</h4>
                <p>{user?.email}</p>
              </div>

              <div className="infoBlock">
                <h4>Joined On</h4>
                <p>{user?.createdAt ? String(user.createdAt).substr(0, 10) : "N/A"}</p>
              </div>

              <div className="profileActions">
                <Link to="/orders">My Orders</Link>
                <Link to="/password/update">Change Password</Link>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Profile;
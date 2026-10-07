import React from "react";
import "./sidebar.css";
import logo from "../../images/logo.png";
import { Link, useLocation } from "react-router-dom";
import { TreeView, TreeItem } from "@material-ui/lab";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PostAddIcon from "@material-ui/icons/PostAdd";
import AddIcon from "@material-ui/icons/Add";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListAltIcon from "@material-ui/icons/ListAlt";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PeopleIcon from "@material-ui/icons/People";
import RateReviewIcon from "@material-ui/icons/RateReview";
import ShoppingBasketIcon from "@material-ui/icons/ShoppingBasket";
import CategoryIcon from "@material-ui/icons/Category";

const Sidebar = ({ sidebarWidth = 240, setSidebarWidth }) => {
  const location = useLocation();

  const handleMouseDown = (e) => {
    if (!setSidebarWidth) return;
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const handleMouseMove = (moveEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);
      if (newWidth >= 180 && newWidth <= 450) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <aside className="sidebar" style={{ width: `${sidebarWidth}px` }}>
      <div className="resizerHandle" onMouseDown={handleMouseDown} title="Drag to resize sidebar" />

      <div className="sidebarLogoContainer">
        <Link to="/" className="sidebarLogoLink">
          <img src={logo} alt="Logo" className="sidebarLogo" />
        </Link>
      </div>

      <nav className="sidebarNav">
        <Link
          to="/admin/dashboard"
          className={`navLink ${location.pathname === "/admin/dashboard" ? "active" : ""}`}
        >
          <DashboardIcon className="navIcon" />
          <span>Dashboard</span>
        </Link>

        <div className="treeViewWrapper">
          <TreeView
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
          >
            <TreeItem
              nodeId="1"
              label={
                <div className="treeLabelGroup">
                  <ShoppingBasketIcon className="navIcon" />
                  <span>Products</span>
                </div>
              }
            >
              <Link
                to="/admin/products"
                className={`treeSubLink ${location.pathname === "/admin/products" ? "active" : ""}`}
              >
                <TreeItem nodeId="2" label="All Products" icon={<PostAddIcon />} />
              </Link>
              <Link
                to="/admin/product"
                className={`treeSubLink ${location.pathname === "/admin/product" ? "active" : ""}`}
              >
                <TreeItem nodeId="3" label="Create Product" icon={<AddIcon />} />
              </Link>
            </TreeItem>
          </TreeView>
        </div>

        <Link
          to="/admin/categories"
          className={`navLink ${location.pathname === "/admin/categories" ? "active" : ""}`}
        >
          <CategoryIcon className="navIcon" />
          <span>Categories</span>
        </Link>

        <Link
          to="/admin/orders"
          className={`navLink ${location.pathname === "/admin/orders" ? "active" : ""}`}
        >
          <ListAltIcon className="navIcon" />
          <span>Orders</span>
        </Link>

        <Link
          to="/admin/users"
          className={`navLink ${location.pathname === "/admin/users" ? "active" : ""}`}
        >
          <PeopleIcon className="navIcon" />
          <span>Users</span>
        </Link>

        <Link
          to="/admin/reviews"
          className={`navLink ${location.pathname === "/admin/reviews" ? "active" : ""}`}
        >
          <RateReviewIcon className="navIcon" />
          <span>Reviews</span>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
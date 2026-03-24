import React, { useEffect } from "react";
import Sidebar from "./Sidebar.js";
import "./dashboard.css";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAdminProduct } from "../../actions/productAction";
import { getAllOrders } from "../../actions/orderAction.js";
import { getAllUsers } from "../../actions/userAction.js";
import MetaData from "../layout/MetaData";

// Import Chart.js essentials to avoid rendering errors
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const dispatch = useDispatch();

  const { products } = useSelector((state) => state.products);
  const { orders } = useSelector((state) => state.allOrders);
  const { users } = useSelector((state) => state.allUsers);

  let outOfStock = 0;
  products &&
    products.forEach((item) => {
      if (item.Stock === 0) {
        outOfStock += 1;
      }
    });

  useEffect(() => {
    dispatch(getAdminProduct());
    dispatch(getAllOrders());
    dispatch(getAllUsers());
  }, [dispatch]);

  let totalAmount = 0;
  orders &&
    orders.forEach((item) => {
      totalAmount += item.totalPrice;
    });

  const lineState = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [
      {
        label: "Total Revenue (₹)",
        backgroundColor: "rgba(56, 189, 248, 0.2)",
        borderColor: "#38bdf8",
        borderWidth: 2,
        pointBackgroundColor: "#38bdf8",
        data: [0, totalAmount],
        fill: true,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "#94a3b8" },
      },
    },
    scales: {
      x: {
        ticks: { color: "#94a3b8" },
        grid: { color: "#1e293b" },
      },
      y: {
        ticks: { color: "#94a3b8" },
        grid: { color: "#1e293b" },
      },
    },
  };

  const doughnutState = {
    labels: ["Out of Stock", "In Stock"],
    datasets: [
      {
        backgroundColor: ["#f87171", "#34d399"],
        hoverBackgroundColor: ["#ef4444", "#10b981"],
        borderWidth: 0,
        data: [outOfStock, products ? products.length - outOfStock : 0],
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#94a3b8", padding: 20 },
      },
    },
  };

  return (
    <div className="dashboard">
      <MetaData title="Admin Dashboard" />
      <Sidebar />

      <div className="dashboardContainer">
        <div className="dashboardHeader">
          <h1>Admin Overview</h1>
        </div>

        {/* Top Summary Banner */}
        <div className="totalRevenueCard">
          <span className="revenueLabel">Total Revenue Earned</span>
          <h2 className="revenueValue">₹{totalAmount?.toLocaleString()}</h2>
        </div>

        {/* Quick Stats Grid */}
        <div className="statsGrid">
          <Link to="/admin/products" className="statCard">
            <span className="statTitle">Products</span>
            <span className="statValue">{products ? products.length : 0}</span>
          </Link>

          <Link to="/admin/orders" className="statCard">
            <span className="statTitle">Orders</span>
            <span className="statValue">{orders ? orders.length : 0}</span>
          </Link>

          <Link to="/admin/users" className="statCard">
            <span className="statTitle">Users</span>
            <span className="statValue">{users ? users.length : 0}</span>
          </Link>
        </div>

        {/* Analytics Charts */}
        <div className="chartsGrid">
          <div className="chartCard">
            <h3>Revenue Growth</h3>
            <div className="chartWrapper">
              <Line data={lineState} options={lineOptions} />
            </div>
          </div>

          <div className="chartCard">
            <h3>Product Stock Status</h3>
            <div className="chartWrapper">
              <Doughnut data={doughnutState} options={doughnutOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
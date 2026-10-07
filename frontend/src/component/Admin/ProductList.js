import React, { Fragment, useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./productList.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getAdminProduct,
  deleteProduct,
} from "../../actions/productAction";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import SideBar from "./Sidebar";
import { DELETE_PRODUCT_RESET } from "../../constants/productConstants";

const ProductList = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const [sidebarWidth, setSidebarWidth] = useState(240);

  const { error, products } = useSelector((state) => state.products);
  const { error: deleteError, isDeleted } = useSelector((state) => state.product);

  const deleteProductHandler = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success("Product Deleted Successfully");
      // Reset delete status
      dispatch({ type: DELETE_PRODUCT_RESET });
      // Re-fetch products locally to update table without navigation
      dispatch(getAdminProduct());
    } else {
      dispatch(getAdminProduct());
    }
  }, [dispatch, alert, error, deleteError, isDeleted]);

  const columns = [
    {
      field: "product",
      headerName: "Product",
      minWidth: 240,
      flex: 2,
      renderCell: (params) => (
        <div 
          className="productCell"
          onClick={() => navigate(`/product/${params.row.id}`)}
          title="View product details"
        >
          <img 
            src={params.row.image || "/Profile.png"} 
            alt={params.row.name} 
            className="productTableImg" 
          />
          <span className="tableCellName">{params.row.name}</span>
        </div>
      )
    },
    {
      field: "Stock",
      headerName: "Stock Status",
      type: "number",
      minWidth: 130,
      flex: 1,
      headerAlign: "left",
      align: "left",
      renderCell: (params) => {
        const inStock = params.value > 0;
        return (
          <span className={`stockBadge ${inStock ? "inStock" : "outOfStock"}`}>
            <span className="badgeDot" />
            {inStock ? `${params.value} available` : "Out of stock"}
          </span>
        );
      }
    },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      minWidth: 110,
      flex: 0.9,
      headerAlign: "left",
      align: "left",
      renderCell: (params) => (
        <span className="tableCellPrice">₹{params.value?.toLocaleString()}</span>
      )
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 100,
      flex: 0.8,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div className="actionButtons" onClick={(e) => e.stopPropagation()}>
          <Link to={`/admin/product/${params.row.id}`} className="actionBtn edit" title="Edit">
            <EditIcon style={{ fontSize: 16 }} />
          </Link>
          <button onClick={(e) => deleteProductHandler(e, params.row.id)} className="actionBtn delete" title="Delete">
            <DeleteIcon style={{ fontSize: 16 }} />
          </button>
        </div>
      ),
    },
  ];

  const rows = [];
  products &&
    products.forEach((item) => {
      rows.push({
        id: item._id,
        image: item.images && item.images[0] ? item.images[0].url : "",
        name: item.name,
        Stock: item.Stock,
        price: item.price,
      });
    });

  return (
    <Fragment>
      <MetaData title="All Products - Admin" />

      <div className="adminLayout">
        <SideBar sidebarWidth={sidebarWidth} setSidebarWidth={setSidebarWidth} />

        <main className="adminContent" style={{ width: `calc(100% - ${sidebarWidth}px)` }}>
          <div className="productListHeader">
            <div>
              <h1>Products Directory</h1>
              <p className="subHeading">Click any row to manage inventory and pricing</p>
            </div>
            <Link to="/admin/product" className="createBtn">
              + New Product
            </Link>
          </div>

          <div className="tableCardContainer">
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={8}
              disableSelectionOnClick
              className="customDataGrid"
              autoHeight
            />
          </div>
        </main>
      </div>
    </Fragment>
  );
};

export default ProductList;
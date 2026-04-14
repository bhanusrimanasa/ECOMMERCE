import React, { Fragment, useEffect, useState } from "react";
import "./newProduct.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, createProduct } from "../../actions/productAction";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import DescriptionIcon from "@material-ui/icons/Description";
import StorageIcon from "@material-ui/icons/Storage";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import CloseIcon from "@material-ui/icons/Close";
import SideBar from "./Sidebar";
import { NEW_PRODUCT_RESET } from "../../constants/productConstants";
import { useNavigate } from "react-router-dom";

const NewProduct = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { loading, error, success } = useSelector((state) => state.newProduct);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [Stock, setStock] = useState("");
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const categories = [
    "Laptop",
    "Footwear",
    "Bottom",
    "Tops",
    "Attire",
    "Camera",
    "SmartPhones",
  ];

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Product Created Successfully");
      navigate("/admin/dashboard");
      dispatch({ type: NEW_PRODUCT_RESET });
    }
  }, [dispatch, alert, error, navigate, success]);

  const createProductSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("Stock", Stock);

    images.forEach((image) => {
      myForm.append("images", image);
    });

    dispatch(createProduct(myForm));
  };

  // Append new images to state without clearing existing ones
  const createProductImagesChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  // Remove individual selected image from array
  const removeImage = (indexToRemove) => {
    setImagesPreview((old) => old.filter((_, index) => index !== indexToRemove));
    setImages((old) => old.filter((_, index) => index !== indexToRemove));
  };

  return (
    <Fragment>
      <MetaData title="Create Product" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">
          <form
            className="createProductForm"
            encType="multipart/form-data"
            onSubmit={createProductSubmitHandler}
          >
            <h1>Create Product</h1>

            <div className="inputField">
              <SpellcheckIcon />
              <input
                type="text"
                placeholder="Product Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="inputField">
              <AttachMoneyIcon />
              <input
                type="number"
                placeholder="Price"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="inputField">
              <DescriptionIcon />
              <textarea
                placeholder="Product Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                cols="30"
                rows="2"
              ></textarea>
            </div>

            <div className="inputField">
              <AccountTreeIcon />
              <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="">Choose Category</option>
                {categories.map((cate) => (
                  <option key={cate} value={cate}>
                    {cate}
                  </option>
                ))}
              </select>
            </div>

            <div className="inputField">
              <StorageIcon />
              <input
                type="number"
                placeholder="Stock"
                required
                value={Stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>

            <div className="customUploadArea">
              <label htmlFor="fileInput" className="uploadBtn">
                Select Images ({images.length})
              </label>
              <input
                id="fileInput"
                type="file"
                name="avatar"
                accept="image/*"
                onChange={createProductImagesChange}
                multiple
                style={{ display: "none" }}
              />
            </div>

            {/* Selected Images Grid with Removal Option */}
            {imagesPreview.length > 0 && (
              <div id="createProductFormImage">
                {imagesPreview.map((image, index) => (
                  <div key={index} className="imageCard">
                    <img src={image} alt={`Product Preview ${index + 1}`} />
                    <button
                      type="button"
                      className="removeImgBtn"
                      onClick={() => removeImage(index)}
                      title="Remove Image"
                    >
                      <CloseIcon style={{ fontSize: 13 }} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              id="createProductBtn"
              type="submit"
              disabled={loading ? true : false}
            >
              {loading ? "Creating..." : "Create Product"}
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default NewProduct;
import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  updateProduct,
  getProductDetails,
} from "../../actions/productAction";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import SideBar from "./Sidebar";
import CloseIcon from "@material-ui/icons/Close";
import { UPDATE_PRODUCT_RESET } from "../../constants/productConstants";
import { useNavigate, useParams } from "react-router-dom";
import "./updateProduct.css";

const DEFAULT_CATEGORIES = [
  "Laptop",
  "Footwear",
  "Bottom",
  "Tops",
  "Attire",
  "Camera",
  "SmartPhones",
];

const UpdateProduct = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const { id } = useParams();

  const [sidebarWidth, setSidebarWidth] = useState(240);

  const { error, product } = useSelector((state) => state.productDetails);
  const {
    loading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.product);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [Stock, setStock] = useState("");
  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const productId = id;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/v1/categories");
        const data = await res.json();
        if (data.success && Array.isArray(data.categories)) {
          const dbCatNames = data.categories.map((c) => c.name);
          setCategories(Array.from(new Set([...DEFAULT_CATEGORIES, ...dbCatNames])));
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (product && product._id !== productId) {
      dispatch(getProductDetails(productId));
    } else if (product) {
      setName(product.name || "");
      setDescription(product.description || "");
      setPrice(product.price || "");
      setCategory(product.category || "");
      setStock(product.Stock || "");
      setOldImages(product.images || []);
    }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("Product Updated Successfully");
      navigate("/admin/products");
      dispatch({ type: UPDATE_PRODUCT_RESET });
    }
  }, [
    dispatch,
    alert,
    error,
    navigate,
    isUpdated,
    productId,
    product,
    updateError,
  ]);

  const updateProductSubmitHandler = (e) => {
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

    oldImages.forEach((img) => {
      myForm.append("oldImages", JSON.stringify(img));
    });

    dispatch(updateProduct(productId, myForm));
  };

  const updateProductImagesChange = (e) => {
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

  const removeOldImage = (indexToRemove) => {
    setOldImages((old) => old.filter((_, index) => index !== indexToRemove));
  };

  const removeNewImage = (indexToRemove) => {
    setImagesPreview((old) => old.filter((_, index) => index !== indexToRemove));
    setImages((old) => old.filter((_, index) => index !== indexToRemove));
  };

  return (
    <Fragment>
      <MetaData title="Update Product - Admin" />
      <div className="adminLayout">
        <SideBar sidebarWidth={sidebarWidth} setSidebarWidth={setSidebarWidth} />

        <main className="adminContent" style={{ width: `calc(100% - ${sidebarWidth}px)` }}>
          <div className="updateProductCard">
            <h1 className="pageTitle">Update Product</h1>

            <form className="cleanForm" onSubmit={updateProductSubmitHandler}>
              <div className="formRow">
                <div className="fieldGroup">
                  <label>Product Name</label>
                  <input
                    type="text"
                    placeholder="Enter product title"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="fieldGroup">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    placeholder="0"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="formRow">
                <div className="fieldGroup">
                  <label>Category</label>
                  <select
                    value={category}
                    required
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cate) => (
                      <option key={cate} value={cate}>
                        {cate}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="fieldGroup">
                  <label>Stock Count</label>
                  <input
                    type="number"
                    placeholder="0"
                    required
                    value={Stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>
              </div>

              <div className="fieldGroup">
                <label>Description</label>
                <textarea
                  placeholder="Enter product description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                ></textarea>
              </div>

              <div className="fieldGroup">
                <label>Add New Images</label>
                <div className="customUploadArea">
                  <label htmlFor="fileInput" className="uploadBtn">
                    Choose Images
                  </label>
                  <span className="fileCount">
                    {images.length > 0
                      ? `${images.length} new image(s) selected`
                      : "Select image files to add"}
                  </span>
                  <input
                    id="fileInput"
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={updateProductImagesChange}
                    multiple
                    style={{ display: "none" }}
                  />
                </div>
              </div>

              {oldImages && oldImages.length > 0 && (
                <div className="imageGallerySection">
                  <span className="sectionLabel">Current Product Images ({oldImages.length})</span>
                  <div className="orderImageGrid">
                    {oldImages.map((image, index) => (
                      <div key={index} className="largeImgCard">
                        <img src={image.url} alt={`Product Image ${index + 1}`} />
                        <span className="imgBadge">#{index + 1}</span>
                        <button
                          type="button"
                          className="removeImgBtn"
                          onClick={() => removeOldImage(index)}
                          title="Remove image from product"
                        >
                          <CloseIcon style={{ fontSize: 13 }} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {imagesPreview.length > 0 && (
                <div className="imageGallerySection">
                  <span className="sectionLabel">New Uploads To Add ({imagesPreview.length})</span>
                  <div className="orderImageGrid">
                    {imagesPreview.map((image, index) => (
                      <div key={index} className="largeImgCard activePreview">
                        <img src={image} alt={`New Preview ${index + 1}`} />
                        <span className="imgBadge newBadge">New #{index + 1}</span>
                        <button
                          type="button"
                          className="removeImgBtn"
                          onClick={() => removeNewImage(index)}
                          title="Cancel image selection"
                        >
                          <CloseIcon style={{ fontSize: 13 }} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button type="submit" className="saveBtn" disabled={loading}>
                {loading ? "Updating..." : "Update Product"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </Fragment>
  );
};

export default UpdateProduct;
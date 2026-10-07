import React, { useState, useEffect, Fragment } from "react";
import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";
import "./CategoryList.css";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      const res = await fetch("/api/v1/admin/category/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensures auth cookie/session token is sent
        body: JSON.stringify({ name: newCategory.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        setNewCategory("");
        fetchCategories();
      } else {
        alert(`Error: ${data.message || "Failed to create category"}`);
      }
    } catch (err) {
      console.error("Error adding category:", err);
      alert("Failed to connect to backend server.");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`/api/v1/admin/category/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();

      if (data.success) {
        fetchCategories();
      } else {
        alert(data.message || "Failed to delete category");
      }
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  return (
    <Fragment>
      <MetaData title="All Categories -- Admin" />
      <div className="dashboard">
        <Sidebar />
        <div className="categoryListContainer">
          <h1 className="categoryListHeading">Manage Categories</h1>

          <form onSubmit={handleAddCategory} className="addCategoryForm">
            <input
              type="text"
              placeholder="Enter new category name..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button type="submit">Add Category</button>
          </form>

          {loading ? (
            <p className="loadingText">Loading categories...</p>
          ) : (
            <div className="categoryGrid">
              {categories.length === 0 ? (
                <p className="noCategoryText">No categories created yet.</p>
              ) : (
                categories.map((cat) => (
                  <div key={cat._id} className="categoryCard">
                    <span>{cat.name}</span>
                    <button
                      onClick={() => handleDeleteCategory(cat._id)}
                      className="deleteCatBtn"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default CategoryList;
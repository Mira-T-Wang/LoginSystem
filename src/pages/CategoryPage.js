import React, { useState, useEffect } from "react";
import CategoryCard from "../components/CategoryCard";
import AddCategoryModal from "../components/AddCategoryModal";
import "../styles/category.css";

function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/category");
      const data = await response.json();
      if (!response.ok) {
        setError("Failed to load categories.");
      } else {
        setCategories(data);
      }
    } catch (err) {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = selectedCategory === "all"
    ? categories
    : categories.filter((cat) => cat._id === selectedCategory);

  const handleAddSuccess = () => {
    setShowAddModal(false);
    fetchCategories();
  };

  if (loading) return <p className="dashboard-loading">Loading categories...</p>;
  if (error) return <p className="dashboard-error">{error}</p>;

  return (
    <div>
      <div className="table-header" style={{ marginBottom: "24px" }}>
        <h2 className="dashboard-title">Categories</h2>
        <div className="category-controls">
          <select
            className="category-sort-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">Sort by: All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          <button
            className="add-button"
            onClick={() => setShowAddModal(true)}
          >
            + Add New Category
          </button>
        </div>
      </div>

      {filteredCategories.length === 0 ? (
        <div className="empty-state">
          <p>No categories found. Add your first category.</p>
        </div>
      ) : (
        <div className="category-grid">
          {filteredCategories.map((cat) => (
            <CategoryCard
              key={cat._id}
              category={cat}
            />
          ))}
        </div>
      )}

      {showAddModal && (
        <AddCategoryModal
          onSuccess={handleAddSuccess}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}

export default CategoryPage;
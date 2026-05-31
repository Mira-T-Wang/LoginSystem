import React, { useState, useRef } from "react";
import "../styles/productModal.css";
function ProductModal({ product, categories, currentUser, onSuccess, onClose }) {
  const isEditing = !!product;

  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price || "");
  const [quantity, setQuantity] = useState(product?.quantity || "");
  const [category, setCategory] = useState(product?.category?._id || "");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    product?.image ? `http://localhost:5000/uploads/${product.image}` : null
  );
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const handleImageChange = (file) => {
    if (!file) return;
    const allowed = ["image/jpeg", "image/jpg", "image/png"];
    const allowedExt = [".jpg", ".jpeg", ".png", ".jfif"];
    const ext = file.name.split(".").pop().toLowerCase();
    if (!allowed.includes(file.type) && !allowedExt.includes("." + ext)) {
      setError("Only JPEG and PNG images are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleImageChange(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !description || !price || !category) {
      return setError("All fields are required.");
    }

    if (!isEditing && !image) {
      return setError("Please upload a product image.");
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("quantity", quantity || 0);
      formData.append("category", category);
      formData.append("createdBy", currentUser.id);
      if (image) formData.append("image", image);

      const url = isEditing ? `/api/products/${product._id}` : "/api/products";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, { method, body: formData });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong.");
      } else {
        onSuccess();
      }
    } catch (err) {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-modal-overlay">
      <div className="product-modal-container">

        {/* Header */}
        <div className="product-modal-header">
          <h3>{isEditing ? "Edit Product" : "Add New Product"}</h3>
          <button className="product-modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Image Upload */}
          <div className="product-form-group">
            <label className="product-form-label">Product Image</label>
            <div
              className={`product-dropzone ${dragOver ? "drag-over" : ""} ${imagePreview ? "has-image" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
            >
              {imagePreview ? (
                <div className="product-image-preview-container">
                  <img src={imagePreview} alt="Preview" className="product-image-preview" />
                  <div className="product-image-preview-overlay">
                    <span>Click or drag to change</span>
                  </div>
                </div>
              ) : (
                <div className="product-dropzone-placeholder">
                  <div className="product-dropzone-icon">🖼️</div>
                  <p className="product-dropzone-text">Drag & drop image here</p>
                  <p className="product-dropzone-subtext">or click to browse</p>
                  <p className="product-dropzone-hint">JPEG, PNG up to 5MB</p>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/jpg,image/png"
              onChange={(e) => handleImageChange(e.target.files[0])}
              style={{ display: "none" }}
            />
          </div>

          {/* Product Name */}
          <div className="product-form-group">
            <label className="product-form-label">Product Name</label>
            <input
              type="text"
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="product-form-input"
            />
          </div>

          {/* Category */}
          <div className="product-form-group">
            <label className="product-form-label">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="product-form-select"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="product-form-group">
            <label className="product-form-label">Description</label>
            <input
              type="text"
              placeholder="Enter product description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="product-form-input"
            />
          </div>

          {/* Quantity */}
          <div className="product-form-group">
            <label className="product-form-label">Quantity</label>
            <input
              type="number"
              placeholder="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="product-form-input"
              min="0"
            />
          </div>

          {/* Price */}
          <div className="product-form-group">
            <label className="product-form-label">Price ($)</label>
            <input
              type="number"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="product-form-input"
              min="0"
              step="0.01"
            />
          </div>

          {error && <p className="product-error">{error}</p>}

          {/* Actions */}
          <div className="product-modal-actions">
            <button type="button" className="product-cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="product-submit-btn" disabled={loading}>
              {loading ? "Saving..." : isEditing ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductModal;
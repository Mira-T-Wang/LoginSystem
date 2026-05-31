import React, { useState } from "react";
import ProductModal from "./ProductModal";
import DeleteProductModal from "./DeleteProductModal";
function ProductTable({ products, categories, currentUser, onRefresh }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleAddSuccess = () => {
    setShowAddModal(false);
    onRefresh();
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    onRefresh();
  };

  const handleDeleteSuccess = () => {
    setShowDeleteModal(false);
    onRefresh();
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <h2 className="table-title">Products</h2>
        <button
          className="add-button"
          onClick={() => setShowAddModal(true)}
        >
          + Add New Product
        </button>
      </div>

      <table className="user-table">
        <thead>
          <th>ID</th>
          <th>Image</th>
          <th>Name</th>
          <th>Category</th>
          <th>Description</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Actions</th>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", color: "#6b7280", padding: "40px" }}>
                No products found. Add your first product.
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product._id}>
                <td className="id-cell">{product._id}</td>
                <td>
                  {product.image ? (
                    <img
                      src={`http://localhost:5000/uploads/${product.image}`}
                      alt={product.name}
                      style={{
                        width: "48px",
                        height: "48px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid rgba(79, 70, 229, 0.3)",
                      }}
                    />
                  ) : (
                    <div style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "8px",
                      background: "rgba(79, 70, 229, 0.1)",
                      border: "1px solid rgba(79, 70, 229, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                    }}>
                      📦
                    </div>
                  )}
                </td>
                <td>{product.name}</td>
                <td>{product.category?.name || "—"}</td>
                <td>{product.description}</td>
                <td>${parseFloat(product.price).toFixed(2)}</td>
                <td>{product.quantity}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="edit-button"
                      onClick={() => handleEditClick(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteClick(product)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showAddModal && (
        <ProductModal
          categories={categories}
          currentUser={currentUser}
          onSuccess={handleAddSuccess}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {showEditModal && selectedProduct && (
        <ProductModal
          product={selectedProduct}
          categories={categories}
          currentUser={currentUser}
          onSuccess={handleEditSuccess}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {showDeleteModal && selectedProduct && (
        <DeleteProductModal
          product={selectedProduct}
          onSuccess={handleDeleteSuccess}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}

export default ProductTable;
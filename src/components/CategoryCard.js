import React from "react";
import "../styles/category.css";
function CategoryCard({ category }) {
  return (
    <div className="category-card">
      <div className="category-card-header">
        <h3 className="category-card-title">{category.name}</h3>
        {category.description && (
          <p className="category-card-description">{category.description}</p>
        )}
        <span className="category-product-count">
          {category.products.length} {category.products.length === 1 ? "product" : "products"}
        </span>
      </div>

      <div className="category-card-body">
        {category.products.length === 0 ? (
          <div className="category-empty">
            <span></span>
            <p>No products in this category yet.</p>
          </div>
        ) : (
          <ul className="category-product-list">
            {category.products.map((product) => (
              <li key={product._id} className="category-product-item">
                <div className="category-product-image-wrapper">
                  {product.image ? (
                    <img
                      src={`http://localhost:5000/uploads/${product.image}`}
                      alt={product.name}
                      className="category-product-image"
                    />
                  ) : (
                    <div className="category-product-no-image"></div>
                  )}
                </div>
                <div className="category-product-info">
                  <span className="category-product-name">{product.name}</span>
                  <span className="category-product-price">
                    ${parseFloat(product.price).toFixed(2)}
                  </span>
                  <span className="category-product-quantity">
                    Qty: {product.quantity}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default CategoryCard;
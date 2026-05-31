import React from "react";

function OrderProductCard({ product, quantity, onAdd, onRemove, onAddToCart, isInCart }) {
  const itemTotal = (product.price * quantity).toFixed(2);
  const isAtMax = quantity >= product.quantity;
  const isAtMin = quantity <= 1;

  return (
    <div className={`order-product-card ${isInCart ? "in-cart" : ""}`}>
      {/* Image */}
      {product.image ? (
        <img
          src={`http://localhost:5000/uploads/${product.image}`}
          alt={product.name}
          className="order-product-image"
        />
      ) : (
        <div className="order-product-no-image">📦</div>
      )}

      {/* Info */}
      <div className="order-product-info">
        <span className="order-product-name">{product.name}</span>
        <span className="order-product-description">{product.description}</span>
        <span className="order-product-price">
          ${parseFloat(product.price).toFixed(2)}
        </span>
        <span className={`order-product-stock ${product.quantity <= 3 ? "low" : ""}`}>
          Stock: {product.quantity}
        </span>
      </div>

      {/* Actions */}
      <div className="order-product-actions">
        {/* Quantity Counter */}
        <div className="quantity-controls">
          <button
            className="quantity-btn"
            onClick={onRemove}
            disabled={isAtMin}
          >
            −
          </button>
          <span className="quantity-value">{quantity}</span>
          <button
            className="quantity-btn"
            onClick={onAdd}
            disabled={isAtMax}
          >
            +
          </button>
        </div>

        {/* Item Total */}
        <span className="order-item-total">${itemTotal}</span>

        {/* Add to Cart Button — replaces delete */}
        <button
          className={`add-to-cart-btn ${isInCart ? "added" : ""}`}
          onClick={() => !isInCart && onAddToCart(product)}
          disabled={isInCart}
        >
          {isInCart ? "✓ Added" : "+ Cart"}
        </button>
      </div>
    </div>
  );
}

export default OrderProductCard;
import React, { useState, useRef } from "react";

function OrderReceipt({
  orderItems,
  products,
  currentUser,
  onCheckoutSuccess,
  onQuantityChange,
  onRemoveItem,
}) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const submittingRef = useRef(false);

  const subtotal = orderItems.reduce((sum, item) => {
    const product = products.find((p) => p._id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const handleCheckout = async () => {
    if (orderItems.length === 0 || submittingRef.current) return;
    submittingRef.current = true;
    setLoading(true);

    const idempotencyKey = `${currentUser.id}-${Date.now()}`;

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderedBy: currentUser.id,
          items: orderItems,
          idempotencyKey,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setToast(data.message || "Checkout failed.");
        submittingRef.current = false;
        setLoading(false);
      } else {
        setToast("Order complete! 🎉");
        setLoading(false);
        setTimeout(() => {
          setToast("");
          submittingRef.current= false;
          onCheckoutSuccess();
        }, 3000);
      }
    } catch (err) {
      setToast("Could not connect to server.");
      submittingRef.current = false;
      setLoading(false);
    } 
  };

  if (orderItems.length === 0) {
    return (
      <div className="receipt-container">
        <h3 className="receipt-title">🛒 Cart</h3>
        <div className="receipt-empty">
          <span className="receipt-empty-icon">🛒</span>
          <p className="receipt-empty-text">
            Your cart is empty. Add products to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="receipt-container">
      {toast && (
        <div className={`receipt-toast ${toast.includes("complete") ? "success" : "error"}`}>
          {toast}
        </div>
      )}

      <h3 className="receipt-title">🛒 Cart ({orderItems.length})</h3>

      <div className="receipt-items">
        {orderItems.map((item) => {
          const product = products.find((p) => p._id === item.productId);
          if (!product) return null;

          const isAtMax = item.quantity >= product.quantity;
          const isAtMin = item.quantity <= 1;

          return (
            <div key={item.productId} className="receipt-cart-item">
              {/* Product image */}
              {product.image ? (
                <img
                  src={`http://localhost:5000/uploads/${product.image}`}
                  alt={product.name}
                  className="receipt-item-image"
                />
              ) : (
                <div className="receipt-item-no-image">📦</div>
              )}

              {/* Product info */}
              <div className="receipt-item-details">
                <p className="receipt-item-name">{product.name}</p>
                <p className="receipt-item-unit-price">
                  ${parseFloat(product.price).toFixed(2)} each
                </p>

                {/* Quantity controls */}
                <div className="receipt-quantity-controls">
                  <button
                    className="receipt-qty-btn"
                    onClick={() => onQuantityChange(item.productId, -1)}
                    disabled={isAtMin}
                  >
                    −
                  </button>
                  <span className="receipt-qty-value">{item.quantity}</span>
                  <button
                    className="receipt-qty-btn"
                    onClick={() => onQuantityChange(item.productId, 1)}
                    disabled={isAtMax}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Right side — total + remove */}
              <div className="receipt-item-right">
                <span className="receipt-item-total">
                  ${(product.price * item.quantity).toFixed(2)}
                </span>
                <button
                  className="receipt-remove-btn"
                  onClick={() => onRemoveItem(item.productId)}
                  title="Remove from cart"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#f87171"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="receipt-divider" />

      <div className="receipt-totals">
        <div className="receipt-total-row">
          <span className="receipt-total-label">Subtotal</span>
          <span className="receipt-total-value">${subtotal.toFixed(2)}</span>
        </div>
        <div className="receipt-total-row">
          <span className="receipt-grand-total-label">Grand Total</span>
          <span className="receipt-grand-total-value">
            ${subtotal.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="receipt-divider" />

      <button
        className="checkout-button"
        onClick={handleCheckout}
        disabled={loading || submittingRef.current}
      >
        {loading ? "Processing..." : `Checkout — $${subtotal.toFixed(2)}`}
      </button>
    </div>
  );
}

export default OrderReceipt;
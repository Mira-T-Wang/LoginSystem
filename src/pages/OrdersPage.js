import React, { useState, useEffect } from "react";
import OrderProductCard from "../components/OrderProductCard";
import OrderReceipt from "../components/OrderReceipt";
import "../styles/orders.css";

function OrdersPage({ user }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      if (!response.ok) {
        setError("Failed to load products.");
      } else {
        setProducts(data.filter((p) => p.quantity > 0));
      }
    } catch (err) {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/category");
      const data = await response.json();
      if (response.ok) setCategories(data);
    } catch (err) {
      console.error("Failed to load categories.");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const filteredProducts = selectedCategory === "all"
    ? products
    : products.filter(
        (p) => p.category && p.category._id === selectedCategory
      );

  // Add to cart with quantity 1
  const handleAddToCart = (product) => {
    setOrderItems((prev) => {
      const existing = prev.find((item) => item.productId === product._id);
      if (existing) return prev;
      return [...prev, { productId: product._id, quantity: 1 }];
    });
  };

  // Increment quantity on card
  const handleAddQty = (product) => {
    setOrderItems((prev) => {
      const existing = prev.find((item) => item.productId === product._id);
      if (existing) {
        if (existing.quantity >= product.quantity) return prev;
        return prev.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return prev;
    });
  };

  // Decrement quantity on card
  const handleRemoveQty = (productId) => {
    setOrderItems((prev) =>
      prev.map((item) =>
        item.productId === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Remove from cart after checkout
  const handleCheckoutSuccess = () => {
    setOrderItems([]);
    fetchProducts();
  };

  const isInCart = (productId) =>
    orderItems.some((item) => item.productId === productId);

  const getQuantity = (productId) => {
    const item = orderItems.find((i) => i.productId === productId);
    return item ? item.quantity : 1;
  };

  if (loading) return <p className="dashboard-loading">Loading products...</p>;
  if (error) return <p className="dashboard-error">{error}</p>;

  return (
    <div>
      {/* Header */}
      <div className="orders-header">
        <h2 className="orders-title">Orders</h2>
        <div className="orders-controls">
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
        </div>
      </div>

      <div className="orders-page">
        {/* Left — Product Catalog */}
        <div className="orders-left">
          {filteredProducts.length === 0 ? (
            <div className="orders-empty">
              <span className="orders-empty-icon">📦</span>
              <p className="orders-empty-text">
                {selectedCategory === "all"
                  ? "No products available."
                  : "No products in this category."}
              </p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <OrderProductCard
                key={product._id}
                product={product}
                quantity={getQuantity(product._id)}
                onAdd={() => handleAddQty(product)}
                onRemove={() => handleRemoveQty(product._id)}
                onAddToCart={handleAddToCart}
                isInCart={isInCart(product._id)}
              />
            ))
          )}
        </div>

        {/* Right — Receipt */}
        <div className="orders-right">
          <OrderReceipt
  orderItems={orderItems}
  products={products}
  currentUser={user}
  onCheckoutSuccess={handleCheckoutSuccess}
  onQuantityChange={(productId, delta) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return;
    setOrderItems((prev) =>
      prev.map((item) => {
        if (item.productId !== productId) return item;
        const newQty = item.quantity + delta;
        if (newQty < 1 || newQty > product.quantity) return item;
        return { ...item, quantity: newQty };
      })
    );
  }}
  onRemoveItem={(productId) =>
    setOrderItems((prev) =>
      prev.filter((item) => item.productId !== productId)
    )
  }
/>
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;
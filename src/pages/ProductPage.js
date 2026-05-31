import React, { useState, useEffect } from "react";
import ProductTable from "../components/ProductTable";

function ProductPage({ user }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      if (!response.ok) {
        setError("Failed to load products.");
      } else {
        setProducts(data);
      }
    } catch (err) {
      setError("Could not connect to server.");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/category");
      const data = await response.json();
      if (response.ok) {
        setCategories(data);
      }
    } catch (err) {
      console.error("Failed to load categories.");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchProducts(), fetchCategories()]);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <p className="dashboard-loading">Loading products...</p>;
  if (error) return <p className="dashboard-error">{error}</p>;

  return (
    <ProductTable
      products={products}
      categories={categories}
      currentUser={user}
      onRefresh={() => {
        fetchProducts();
        fetchCategories();
      }}
    />
  );
}

export default ProductPage;
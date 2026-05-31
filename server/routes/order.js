const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const Notification = require("../models/Notification");
const DailySales = require("../models/DailySales");

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("orderedBy", "email")
      .populate("items.product", "name image");
    return res.status(200).json(orders);
  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ orderedBy: req.params.userId })
      .populate("orderedBy", "email")
      .sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
});

router.post("/", async (req, res) => {
  const { orderedBy, items } = req.body;

  if (!orderedBy || !items || items.length === 0) {
    return res.status(400).json({ message: "Order must have at least one item." });
  }

  try {
    // Batch fetch all products in ONE query
    const productIds = items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    // Build O(1) lookup map
    const productMap = {};
    products.forEach((p) => {
      productMap[p._id.toString()] = p;
    });

    // Validate all items upfront before any writes
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = productMap[item.productId];

      if (!product) {
        return res.status(404).json({
          message: `Product not found: ${item.productId}`,
        });
      }

      if (item.quantity > product.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}. Available: ${product.quantity}`,
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: item.quantity,
        totalPrice: itemTotal,
      });
    }

    // Create order — single write
    const order = await Order.create({
      orderedBy,
      items: orderItems,
      subtotal,
      grandTotal: subtotal,
    });

    // Send response immediately — client does not wait for side effects
    res.status(201).json({
      message: "Order placed successfully!",
      order,
    });

    // Fire and forget — all side effects run after response is sent
    setImmediate(async () => {
      try {
        const todayStr = new Date().toISOString().split("T")[0];
        const totalItemsSold = orderItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );

        // Run all side effects concurrently
        await Promise.all([
          // Update product quantities + trigger stock notifications
          ...items.map((item) =>
            Product.findByIdAndUpdate(
              item.productId,
              { $inc: { quantity: -item.quantity } },
              { returnDocument: "after" }
            ).then(async (updatedProduct) => {
              if (
                updatedProduct.quantity <= 3 &&
                updatedProduct.quantity > 0
              ) {
                await Notification.create({
                  type: "low_stock",
                  title: "Low Stock Alert",
                  message: `${updatedProduct.name} is running low — only ${updatedProduct.quantity} left in stock.`,
                  icon: "📦",
                  relatedId: updatedProduct._id,
                });
              }
              if (updatedProduct.quantity === 0) {
                await Notification.create({
                  type: "low_stock",
                  title: "Out of Stock",
                  message: `${updatedProduct.name} is now out of stock.`,
                  icon: "⚠️",
                  relatedId: updatedProduct._id,
                });
              }
            })
          ),

          Notification.create({
            type: "order",
            title: "New Order Placed",
            message: `A new order of $${subtotal.toFixed(2)} has been placed successfully.`,
            icon: "🛒",
            relatedId: order._id,
          }),

          // DailySales upsert
          DailySales.findOneAndUpdate(
            { date: todayStr },
            {
              $inc: {
                revenue: subtotal,
                orderCount: 1,
                itemsSold: totalItemsSold,
              },
            },
            { upsert: true, returnDocument: "after" }
          ),
        ]);

        console.log(`[Order] Side effects completed for order ${order._id}`);

      } catch (err) {
        console.error(
          `[Order] Side effect error for order ${order._id}:`,
          err.message
        );
      }
    });

  } catch (err) {
    console.error("Order create error:", err.message);
    return res.status(500).json({ message: err.message || "Server error." });
  }
});

module.exports = router;
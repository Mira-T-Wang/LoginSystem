const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const User = require("../models/User");
const Order = require("../models/Order");
const DailySales = require("../models/DailySales");

router.get("/", async (req, res) => {
  try {
    // Stat cards — lightweight countDocuments calls
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();

    const soldResult = await Order.aggregate([
      { $unwind: "$items" },
      { $group: { _id: null, total: { $sum: "$items.quantity" } } },
    ]);
    const soldProducts = soldResult.length > 0 ? soldResult[0].total : 0;

    const revenueResult = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$grandTotal" } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Graph data — read from DailySales materialized view
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setUTCDate(date.getUTCDate() - i);
      last7Days.push(date.toISOString().split("T")[0]);
    }

    const salesDocs = await DailySales.find({
      date: { $in: last7Days },
    }).lean();

    const graphData = last7Days.map((dateStr) => {
      const found = salesDocs.find((doc) => doc.date === dateStr);
      return {
        date: dateStr,
        revenue: found ? found.revenue : 0,
        orderCount: found ? found.orderCount : 0,
        itemsSold: found ? found.itemsSold : 0,
      };
    });

    return res.status(200).json({
      totalProducts,
      totalUsers,
      soldProducts,
      totalRevenue,
      graphData,
    });

  } catch (err) {
    console.error("Stats error:", err.message);
    return res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
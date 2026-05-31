const cron = require("node-cron");
const Order = require("../models/Order");
const DailySales = require("../models/DailySales");

const reconcileDailySales = async (targetDate) => {
  try {
    const dateStr = targetDate || new Date().toISOString().split("T")[0];

    const startOfDay = new Date(`${dateStr}T00:00:00.000Z`);
    const endOfDay = new Date(`${dateStr}T23:59:59.999Z`);

    const result = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$grandTotal" },
          orderCount: { $sum: 1 },
          itemsSold: { $sum: { $sum: "$items.quantity" } },
        },
      },
    ]);

    const data = result[0] || { revenue: 0, orderCount: 0, itemsSold: 0 };

    await DailySales.findOneAndUpdate(
      { date: dateStr },
      {
        $set: {
          revenue: data.revenue,
          orderCount: data.orderCount,
          itemsSold: data.itemsSold,
        },
      },
      { upsert: true, returnDocument: "after" }
    );

    console.log(`[Reconciliation] ${dateStr} → revenue: $${data.revenue.toFixed(2)}, orders: ${data.orderCount}, items: ${data.itemsSold}`);

  } catch (err) {
    console.error(`[Reconciliation] Failed for ${targetDate}:`, err.message);
  }
};

const registerCronJobs = () => {
  // Run every ten minutes 
  cron.schedule("*/10 * * * *", async () => {
    console.log("[Cron] Running 10 minutes sales reconciliation...");
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    await reconcileDailySales(todayStr);
  });

  const warmupDailySales = async () => {
    console.log("[Startup] Warming up DailySales for last 7 days...");
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setUTCDate(date.getUTCDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      await reconcileDailySales(dateStr);
    }
    console.log("[Startup] DailySales warmup complete.");
  };

  warmupDailySales();
};

module.exports = { registerCronJobs, reconcileDailySales };
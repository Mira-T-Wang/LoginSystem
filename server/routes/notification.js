const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find({})
      .sort({ createdAt: -1 })
      .limit(20);
    const unreadCount = await Notification.countDocuments({ read: false });
    return res.status(200).json({ notifications, unreadCount });
  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
});

router.put("/mark-all-read", async (req, res) => {
  try {
    await Notification.updateMany({ read: false }, { read: true });
    return res.status(200).json({ message: "All marked as read." });
  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
});

router.delete("/clear", async (req, res) => {
  try {
    await Notification.deleteMany({});
    return res.status(200).json({ message: "All notifications cleared." });
  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
});

router.put("/:id/read", async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { returnDocument: "after" }
    );
    return res.status(200).json({ message: "Marked as read." });
  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
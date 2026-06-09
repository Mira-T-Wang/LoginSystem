const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Notification = require("../models/Notification");
const requireAuth = require('../middleware/auth');
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

await Notification.create({
  type: "new_user",
  title: "New User Registered",
  message: `${newUser.email} has created a new account.`,
  //icon: "👥",
  relatedId: newUser._id,
});

return res.status(201).json({
  message: "Account created successfully!",
  user: { id: newUser._id, email: newUser.email, createdAt: newUser.createdAt },
});

  } catch (err) {
    return res.status(500).json({ message: "Server error. Please try again." });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required.",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
        attemptsLeft: null,
      });
    }

    const now = new Date();
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
    const MAX_ATTEMPTS = 10;

    // Auto-reset after 24 hours have passed since last failure
    if (
      user.lastFailedAt &&
      now - new Date(user.lastFailedAt) >= TWENTY_FOUR_HOURS
    ) {
      await User.findByIdAndUpdate(user._id, {
        loginAttempts: 0,
        lockoutUntil: null,
        lastFailedAt: null,
      });
      user.loginAttempts = 0;
      user.lockoutUntil = null;
      user.lastFailedAt = null;
    }

    // Check if account is currently locked
    if (user.lockoutUntil && user.lockoutUntil > now) {
      const remainingMs = user.lockoutUntil - now;
      const remainingSeconds = Math.ceil(remainingMs / 1000);
      const isPermanentLock = user.loginAttempts >= MAX_ATTEMPTS;

      return res.status(429).json({
        message: isPermanentLock
          ? "Account locked for 24 hours. Contact admin if this is a mistake."
          : "Account locked. Too many failed attempts.",
        remainingSeconds,
        lockedUntil: user.lockoutUntil.getTime(),
        isPermanentLock,
      });
    }

    // Lockout expired — clear lockoutUntil but KEEP loginAttempts
    if (user.lockoutUntil && user.lockoutUntil <= now) {
      await User.findByIdAndUpdate(user._id, {
        lockoutUntil: null,
      });
      user.lockoutUntil = null;
      // loginAttempts NOT reset — escalation must persist
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      const newAttempts = user.loginAttempts + 1;
      const now = new Date();

      // Attempt 10 apply 24 hour permanent lockout
      if (newAttempts >= MAX_ATTEMPTS) {
        const lockoutUntil = new Date(Date.now() + TWENTY_FOUR_HOURS);

        await User.findByIdAndUpdate(user._id, {
          loginAttempts: newAttempts,
          lockoutUntil,
          lastFailedAt: now,
        });

        return res.status(429).json({
          message:
            "Account locked for 24 hours. Contact admin if this is a mistake.",
          remainingSeconds: Math.ceil(TWENTY_FOUR_HOURS / 1000),
          lockedUntil: lockoutUntil.getTime(),
          isPermanentLock: true,
        });
      }

      // Every 3rd attempt — apply escalating lockout
      const shouldLock = newAttempts % 3 === 0;

      if (shouldLock) {
        const lockoutPeriods = Math.floor(newAttempts / 3);
        const lockoutDurationMs = lockoutPeriods * 30 * 1000;
        const lockoutUntil = new Date(Date.now() + lockoutDurationMs);

        await User.findByIdAndUpdate(user._id, {
          loginAttempts: newAttempts,
          lockoutUntil,
          lastFailedAt: now,
        });

        return res.status(429).json({
          message: "Too many failed attempts. Account locked.",
          remainingSeconds: Math.ceil(lockoutDurationMs / 1000),
          lockedUntil: lockoutUntil.getTime(),
          isPermanentLock: false,
        });
      }

      // Not a lockout attempt — increment and return attempts remaining
      await User.findByIdAndUpdate(user._id, {
        loginAttempts: newAttempts,
        lastFailedAt: now,
      });

      const attemptsLeft = 3 - (newAttempts % 3);

      return res.status(401).json({
        message: "Invalid email or password.",
        attemptsLeft,
      });
    }

    // Successful login — reset all lockout state
    await User.findByIdAndUpdate(user._id, {
      loginAttempts: 0,
      lockoutUntil: null,
      lastFailedAt: null,
    });

    const token = jwt.sign(
      { id: user._id},
      process.env.JWT_SECRET,
      { expiresIn: "1d"}
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // false on local host
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // for 1 day
    });

    return res.status(200).json({
      message: "Login successful!",
      user: {
        id: user._id,
        email: user.email,
        createdAt: user.createdAt,
      }, 
    });

  } catch (err) {
    return res.status(500).json({ message: "Server error. Please try again." });
  }
});

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
});

// Update own email and password
router.put("/users/:id", async (req, res) => {
  const { email, password } = req.body;

  try {
    const updateData = {};

    if (email) {
      updateData.email = email;
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters." });
      }
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: "after", select: "-password" }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      message: "Account updated successfully!",
      user: updatedUser,
    });

  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ message: "Account deleted successfully." });

  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
});

// Get current logged-in user

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ message: 'Server error.' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
  });
  return res.status(200).json({ message: 'Logged out successfully.' });
});

// Get current user plan
router.get('/plan', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('plan email');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.status(200).json({ plan: user.plan, email: user.email });
  } catch (err) {
    return res.status(500).json({ message: 'Server error.' });
  }
});
module.exports = router;
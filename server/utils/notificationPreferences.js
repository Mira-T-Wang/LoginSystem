const User = require('../models/User');
async function shouldNotify(preferenceKey) {
  try {
    const adminUser = await User.findOne().sort({ createdAt: 1 }).select('notificationPreferences');
    if (!adminUser) return true; // fail open if no user exists yet
    return adminUser.notificationPreferences?.[preferenceKey] !== false;
  } catch (err) {
    console.warn('Preference check failed, defaulting to notify:', err.message);
    return true; 
  }
}

module.exports = shouldNotify;
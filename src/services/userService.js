const { User } = require("../models/User");

const saveUser = async (userId, chatId, data = {}) => {
  try {
    return await User.findOneAndUpdate(
      { userId },
      {
        userId,
        chatId,
        lastActive: new Date(),
        ...data,
      },
      { upsert: true, new: true },
    );
  } catch (error) {
    console.error("Error saving user:", error);
    throw error;
  }
};

const getUser = async (userId) => {
  try {
    return await User.findOne({ userId });
  } catch (error) {
    console.error("Error retrieving user:", error);
    throw error;
  }
};

const getAllActiveUsers = async () => {
  try {
    return await User.find({ alertEnabled: true });
  } catch (error) {
    console.error("Error retrieving active users:", error);
    throw error;
  }
};

const updateUserSettings = async (userId, settings) => {
  try {
    return await User.findOneAndUpdate(
      { userId },
      { ...settings, lastActive: new Date() },
      { new: true },
    );
  } catch (error) {
    console.error("Error updating user settings:", error);
    throw error;
  }
};

const getUserStats = async () => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ alertEnabled: true });
    return { totalUsers, activeUsers };
  } catch (error) {
    console.error("Error retrieving user stats:", error);
    throw error;
  }
};

module.exports = {
  saveUser,
  getUser,
  getAllActiveUsers,
  updateUserSettings,
  getUserStats,
};

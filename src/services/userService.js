import User from "../models/User.js";
import bcrypt from "bcrypt";

const createUser = async (userData) => {
  const user = new User(userData);
  await user.save();
  return user;
};

const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Invalid email or password"); // Don't reveal which field is wrong for security
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password); // Use bcrypt.compare

    if (!isPasswordMatch) {
      throw new Error("Invalid email or password");
    }

    return user; // Return user details on successful login
  } catch (error) {
    throw error;
  }
};

const changeUserRole = async (adminId, userEmailToBeChanged, newRole) => {
  try {
    const adminUser = await User.findById(adminId); // Find admin by ID

    if (!adminUser) {
      throw new Error("Admin user not found");
    }

    if (adminUser.role !== "admin") {
      throw new Error("Only admins can change user roles.");
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: userEmailToBeChanged },
      { role: newRole },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throw new Error("User not found.");
    }

    return updatedUser;
  } catch (error) {
    throw error;
  }
};

export default { createUser, loginUser, changeUserRole };

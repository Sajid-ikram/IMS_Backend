import User from "../models/User.js";

const createUser = async (userData) => {
  const user = new User(userData);
  await user.save();
  return user;
};

export default { createUser };

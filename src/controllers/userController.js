import userService from "../services/userService.js";

const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userService.getUserDetails(userId);

    res.json(user);
  } catch (error) {
    console.error("Error fetching user details", error);
    res
      .status(404)
      .json({ error: error.message || "Failed to fetch user details" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      // Basic validation
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await userService.loginUser(email, password);

    res.json({ message: "Login successful", user }); // Include a success message and send user data
  } catch (error) {
    res.status(401).json({ error: error.message }); // 401 Unuserized for login failures
  }
};

const changeRole = async (req, res) => {
  try {
    const { userEmailToBeChanged, newRole, userId } = req.body;

    // Input validation
    if (!userEmailToBeChanged || !newRole || !userId) {
      return res.status(400).json({
        error:
          "All fields (userId, userEmailToBeChanged, newRole) are required.",
      });
    }

    const updatedUser = await userService.changeUserRole(
      userId,
      userEmailToBeChanged,
      newRole
    );
    res.json(updatedUser);
  } catch (error) {
    console.error("Error in changeRole controller:", error);
    res
      .status(400)
      .json({ error: error.message || "Failed to change user role." });
  }
};

export default { createUser, login, changeRole, getUser };

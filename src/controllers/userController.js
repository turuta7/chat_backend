const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const userStore = require("../store/UserStore");

// Initialize Prisma Client
const prisma = new PrismaClient();

class Users {
  // Get all users
  static async getAllUsers(req, res) {
    try {
      const users = await prisma.user.findMany(); // Get all users
      res.status(200).json(users); // Send the response with users
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Error fetching users" });
    }
  }

  // Get a single user by id
  static async getUserById(req, res) {
    try {
      const { id } = req.params; // Get id from request parameters
      const user = await prisma.user.findUnique({
        where: { id }, // Search by id
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user); // Send the found user
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Error fetching user" });
    }
  }

  // Get a single user by name
  static async getUserByName(req, res) {
    try {
      const { username, password } = req.body;
      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      console.log("********************************");
      console.log(user);
      // Hash password before saving
      const match = await bcrypt.compare(password, user.password);

      console.log(match);
      if (!match) {
        return res.status(400).json({ message: "Error pass" });
      }
      req.session.user = { username: user.username, id: user.id };
      res.status(200).json({ message: "Login - OK", user: user.username });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Error fetching user" });
    }
  }

  // Create a new user
  static async createUser(req, res) {
    try {
      const { username, password } = req.body; // Get username and password from request body

      // Hash password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the new user with hashed password
      const newUser = await prisma.user.create({
        data: {
          username, // Spread the rest of the data
          password: hashedPassword, // Replace plain password with hashed one
        },
      });

      res.status(201).json({ message: "Регистрация успешна", user: newUser });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Error creating user" });
    }
  }

  // Update user information
  static async updateUser(req, res) {
    try {
      const { id } = req.params; // Get id from request parameters
      const { username, password } = req.body; // Get new data from request body

      let updatedData = { ...req.body };

      // If password is provided, hash it before updating
      if (password) {
        updatedData.password = await bcrypt.hash(password, 10); // Hash the new password
      }

      const updatedUser = await prisma.user.update({
        where: { id }, // Search by id
        data: updatedData, // New data
      });

      res.status(200).json(updatedUser); // Send the updated user
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Error updating user" });
    }
  }

  // Delete a user by id
  static async deleteUser(req, res) {
    try {
      const { id } = req.params; // Get id from request parameters
      const deletedUser = await context.query.User.delete({
        where: { id }, // Search by id
      });

      res.status(200).json(deletedUser); // Send the deleted user
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Error deleting user" });
    }
  }
}

module.exports = Users;

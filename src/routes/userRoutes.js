const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Get all users
router.get("/", userController.getAllUsers);

// Get all users
router.post("/login", userController.getUserByName);

// Get a single user by id
router.get("/:id", userController.getUserById);

// Create a new user
router.post("/", userController.createUser);

// Update user information
router.put("/:id", userController.updateUser);

// Delete a user
router.delete("/:id", userController.deleteUser);

module.exports = router;

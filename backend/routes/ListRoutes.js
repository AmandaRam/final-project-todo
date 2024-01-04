import express from "express";
import verifier from "../middlewares/verifier";
import User from "../models/User";
import getUser from "../services/getUser";

const listRoutes = express.Router();

// This route will get my lists
listRoutes.get("/lists", verifier, async (req, res) => {
  try {
    // Get user from database
    const user = await getUser(req.user.id);
    // If the user does not exist, respond with a 404 error
    if (user === null) {
      res.status(404).json({ message: "User not found" });
      // If the user exists, respond with the user's lists
    } else {
      res.status(200).json({ lists: user.lists });
    }
    // If something goes wrong, respond with a 500 error
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not fetch lists" });
  }
});

// This route will create a new list
listRoutes.post("/lists", verifier, async (req, res) => {
  try {
    // Get user from database
    const user = await getUser(req.user.id);
    const name = req.body.name;
    // Add a new list to the user's lists array
    user.lists.push({ name });
    await user.save();
    // Respond with the new list
    res.status(201).json(user.lists[user.lists.length - 1]);
    // If something goes wrong, respond with a 500 error
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not create list" });
  }
});

export default listRoutes;

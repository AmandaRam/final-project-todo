import express from "express";
import verifier from "../middlewares/verifier";
import User from "../models/User";

const listRoutes = express.Router();

listRoutes.get("/", verifier, async (req, res) => {
  try {
    const externalId = req.user.id;
    const user = await User.findOne({ externalId });
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

export default listRoutes;

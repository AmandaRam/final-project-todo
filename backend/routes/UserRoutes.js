import express from "express";
import User from "../models/User";
import verifier from "../middlewares/verifier";

const userRoutes = express.Router();

userRoutes.get("/profile", verifier, async (req, res) => {
  try {
    const externalId = req.user.id;

    let user = await User.findOne({ externalId });

    if (user === null) {
      user = new User({ externalId });
      await user.save();
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not fetch your profile" });
  }
});

export default userRoutes;

import express from "express";
import getUser from "../services/getUser";
import verifier from "../middlewares/verifier";
import listNameValidator from "../middlewares/listNameValidator";

const listRoutes = express.Router();

// This route will get my lists
listRoutes.get("/lists", verifier, async (req, res) => {
  try {
    // Get user from database
    const user = await getUser(req.user.id);
    res.status(200).json(user.lists);
    // If something goes wrong, respond with a 500 error
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not fetch lists" });
  }
});

// This route will get a specific list
listRoutes.get("/lists/:id", verifier, async (req, res) => {
  try {
    // Get user from database
    const user = await getUser(req.user.id);
    // Finding the list with the specified id
    const list = user.lists.find(
      (list) => list._id.toString() === req.params.id,
    );
    // If the list does not exist, respond with a 404 errors
    if (list === undefined) {
      res.status(404).json({ message: "List not found" });
    } else {
      res.status(200).json(list);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not fetch list" });
  }
});

// This route will create a new list
listRoutes.post("/lists", verifier, listNameValidator, async (req, res) => {
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

// This route will delete a list
listRoutes.delete("/lists/:id", verifier, async (req, res) => {
  try {
    // Get user from database
    const user = await getUser(req.user.id);
    // Remove the list from the array by filtering out the list with the specified id
    user.lists = user.lists.filter(
      (list) => list._id.toString() !== req.params.id,
    );
    await user.save();
    // Respond with a 204 status code with no content
    res.status(204).json();
    // If something goes wrong, respond with a 500 error
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not delete list" });
  }
});

// This route will edit a list
listRoutes.put("/lists/:id", verifier, listNameValidator, async (req, res) => {
  try {
    // Get user from database
    const user = await getUser(req.user.id);

    // Find the list with the specified id
    const index = user.lists.findIndex(
      (list) => list._id.toString() === req.params.id,
    );
    // If the list exists, update the list by finding the list with the specified id
    if (index > -1) {
      // Update the list's name
      user.lists[index].name = req.body.name;
      await user.save();

      // Respond with the updated list
      res.status(200).json(user.lists[index]);
      // If the list does not exist, respond with a 404 error
    } else {
      res.status(404).json({ message: "List not found" });
    }
    // If something goes wrong, respond with a 500 error
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not edit list" });
  }
});

export default listRoutes;

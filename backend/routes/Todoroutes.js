import express from "express";
import verifier from "../middlewares/verifier";
import getUser from "../services/getUser";

const todoRoutes = express.Router();

// This route will get my todos
todoRoutes.get("/lists/:id/todos", verifier, async (req, res) => {
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
      res.status(200).json(list.todos);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not fetch todos" });
  }
});

// This route will create a new todo
todoRoutes.post("/lists/:id/todos", verifier, async (req, res) => {
  try {
    // Get user from database
    const user = await getUser(req.user.id);
    const text = req.body.text;
    // Find the list with the specified id
    const index = user.lists.findIndex(
      (list) => list._id.toString() === req.params.id,
    );
    // If the list exists, update the list by finding the list with the specified id
    if (index > -1) {
      // Update the list's name
      user.lists[index].todos.push({ text, completed: false });
      await user.save();

      // Respond with the added todo
      res
        .status(201)
        // by returning the last todo in the array
        .json(user.lists[index].todos[user.lists[index].todos.length - 1]);
      // If the list does not exist, respond with a 404 error
    } else {
      res.status(404).json({ message: "List not found" });
    }
    // If something goes wrong, respond with a 500 error
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not add todo" });
  }
});

// This route will update a todo
todoRoutes.put("/todos/:id", verifier, async (req, res) => {
  try {
    // Get user from database
    const user = await getUser(req.user.id);

    const text = req.body.text;
    const completed = req.body.completed || false;

    // Setting up validation with the rules that the text must be defined, not null and have a length of at least 1 character
    if (text === undefined || text === null || text.length < 1) {
      res
        .status(400)
        .json({ message: "Text should have at least 1 character" });
      return;
    }

    // Finding the list that contains the todo with the specified id
    const listIndex = user.lists.findIndex((list) =>
      list.todos.find((todo) => todo._id.toString() === req.params.id),
    );

    // If the list exists, update the todo by finding the todo with the specified id
    if (listIndex > -1) {
      // Finding the todo with the specified id
      const todoIndex = user.lists[listIndex].todos.findIndex(
        (todo) => todo._id.toString() === req.params.id,
      );

      // If the todo exists, update the todo with the specified id
      if (todoIndex > -1) {
        user.lists[listIndex].todos[todoIndex].text = text;
        user.lists[listIndex].todos[todoIndex].completed = completed;

        await user.save();
        // Respond with the updated todo
        res.status(200).json(user.lists[listIndex].todos[todoIndex]);
      } else {
        res.status(404).json({ message: "Todo not found" });
      }
    } else {
      res.status(404).json({ message: "Todo not found" });
    }
    // If something goes wrong, respond with a 500 error
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not update todo" });
  }
});

// This route will delete a todo
todoRoutes.delete("/todos/:id", verifier, async (req, res) => {
  try {
    // Get user from database
    const user = await getUser(req.user.id);

    // Finding the list that contains the todo with the specified id
    const listIndex = user.lists.findIndex((list) =>
      list.todos.find((todo) => todo._id.toString() === req.params.id),
    );

    // If the list exists, remove the todo
    if (listIndex > -1) {
      // Remove the todo with the specified id
      user.lists[listIndex].todos = user.lists[listIndex].todos.filter(
        (todo) => todo._id.toString() !== req.params.id,
      );

      await user.save();
      res.status(204).json();
    } else {
      res.status(404).json({ message: "Todo not found" });
    }
    // If something goes wrong, respond with a 500 error
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not update todo" });
  }
});

export default todoRoutes;

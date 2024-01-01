import mongoose from "mongoose";

// Create a schema for the Todo object
const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },

  completed: {
    type: Boolean,
    required: true,
  },
});

// Create a schema for the List object
const listSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  todos: [todoSchema],
});

// Create a schema for the User object
const userSchema = new mongoose.Schema({
  externalId: {
    type: String,
    required: true,
    unique: true,
  },

  lists: [listSchema],
});

// Create a model using userSchema
const User = mongoose.model("User", userSchema);

export default User;

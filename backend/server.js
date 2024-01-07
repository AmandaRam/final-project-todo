import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { jwtVerify } from "@kinde-oss/kinde-node-express";
import listEndpoints from "express-list-endpoints";
import userRoutes from "./routes/UserRoutes";
import listRoutes from "./routes/ListRoutes";
import todoRoutes from "./routes/Todoroutes";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Using my defined routes
app.use(userRoutes);
app.use(listRoutes);
app.use(todoRoutes);

// Documents my API
app.get("/", (_, res) => {
  res.json(listEndpoints(app));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

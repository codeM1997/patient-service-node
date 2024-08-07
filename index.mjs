import express from "express";
import mongoose from "mongoose";
import baseRouter from "./routers/index.mjs";

const app = express();
mongoose
  .connect("mongodb://localhost:27017/patient-service-node")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });
app.listen(9001, () => {
  console.log(`Server is running on port 9001`);
});
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api", baseRouter);

import express from "express";
const app = express();
import baseRouter from "./routers/index.mjs";
app.listen(9001, () => {
  console.log(`Server is running on port 9001`);
});
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api", baseRouter);

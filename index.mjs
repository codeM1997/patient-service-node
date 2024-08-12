import express from "express";
import mongoose from "mongoose";
import baseRouter from "./routers/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import "./strategies/local-strategy.mjs";
import authRouter from "./routers/auth.mjs";
const app = express();
mongoose
  .connect("mongodb://localhost:27017/patient-service-node")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });
app.use(cookieParser("some-secret-key"));
app.use(
  session({
    secret: "some-secret-key",
    cookie: { maxAge: 1000 * 60 * 5 },
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ client: mongoose.connection.getClient() }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.listen(9001, () => {
  console.log(`Server is running on port 9001`);
});
app.use(express.json());
app.get("/", (req, res) => {
  return res.send("Hello World!");
});
app.use("/api/auth", authRouter);
app.use((req, res, next) => {
  console.log('req.path', req.path);
  if(req.path.includes("/api/admins")) return next();
  if (!req.user) return res.status(401).send({ msg: "User not authenticated" });
  next();
});
app.use("/api", baseRouter);

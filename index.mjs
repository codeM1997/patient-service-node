import express from "express";
import mongoose from "mongoose";
import baseRouter from "./routers/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import "./strategies/local-strategy.mjs";
import authRouter from "./routers/auth.mjs";
import { createPdf } from "./utils/helpers.mjs";
import { invoice } from "./utils/data.mjs";
import cors from "cors";
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
const app = express();
app.use(cors(corsOptions));
mongoose
  .connect("mongodb://127.0.0.1:27017/patient-service-node")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });
app.use(cookieParser("some-secret-key"));
app.use(
  session({
    httpOnly: true,
    secret: "some-secret-key",
    cookie: { sameSite: "none", secure: false, maxAge: 5000 * 60 * 5 },
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
app.get("/downloadpdf", async (req, res) => {
  const stream = res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment;filename=invoice.pdf`,
  });
  createPdf(
    invoice,
    (chunk) => stream.write(chunk),
    () => stream.end()
  );
});
app.use("/api/auth", authRouter);
app.use((req, res, next) => {
  console.log("req.path", req.path);
  if (req.path.includes("/api/admins")) return next();
  if (!req.user) return res.status(401).send({ msg: "User not authenticated" });
  next();
});
app.use("/api", baseRouter);

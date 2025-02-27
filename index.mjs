import express from "express";
import mongoose, { set } from "mongoose";
import baseRouter from "./routers/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import "./strategies/local-strategy.mjs";
import authRouter from "./routers/auth.mjs";
import { createPdf } from "./utils/helpers.mjs";
import { invoice } from "./utils/data.mjs";
import { Server } from "socket.io";
import cors from "cors";
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
const app = express();
app.use(cors(corsOptions));

// create a socket connection on port 1997 to listen for incoming messages and on first connection send a message to the client that connection has been established
const io = new Server(1997, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log("Socket connection established",socket.id);
  socket.emit("connection-established",socket.id);
  setTimeout(() => {
    socket.emit("connection-established-timeout",socket.id);
  }, 5000);
});


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
  }),
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
  console.log("req.body", req);
  const {
    doctorName,
    doctorNumber,
    doctorDesignation,
    doctorSubtext,
    patientId,
  } = ({
    doctorName = "Dr John Doe",
    doctorNumber = "9999999999",
    doctorDesignation = "Dentist",
    doctorSubtext = "Something Degree",
    patientId = "1",
  } = req.body);
  const stream = res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment;filename=invoice.pdf`,
  });
  const updatedInvoiceDetails = {
    ...invoice,
    docDetails: {
      doctorName,
      doctorNumber,
      doctorDesignation,
      doctorSubtext,
    },
    patientId,
  };
  createPdf(
    updatedInvoiceDetails,
    (chunk) => stream.write(chunk),
    () => stream.end(),
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

export default io;
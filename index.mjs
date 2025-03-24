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
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
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
  // setTimeout(() => {
  //   socket.emit("connection-established-timeout",socket.id);
  // }, 5000);
});

// MongoDB Atlas connection string from environment variable
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/patient-service-node";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });
app.use(cookieParser(process.env.COOKIE_SECRET || "some-secret-key"));
app.use(
  session({
    httpOnly: true,
    secret: process.env.SESSION_SECRET || "some-secret-key",
    cookie: { 
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 5000 * 60 * 5 
    },
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
app.post("/downloadpdf", async (req, res) => {
  const {
    doctorName = 'John',
    doctorNumber = '123',
    doctorDesignation = 'Psychologist',
    doctorSubtext = 'Clinical Psychologist',
    patientId = "12",
    patientName = "John Doe",
    patientAddress = "1234 Main Street",
    patientCity = "San Francisco",
    patientState = "CA",
    patientCountry = "US",
    patientPostalCode = "94111",
    items = [{
      item: "Counselling Services",
      description: "Psychological Counselling",
      quantity: 1,
      amount: 6000
    }],
    subtotal = 6000,
    invoice_nr = 1234
  } = req.body;

  const stream = res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment;filename=invoice.pdf`,
  });

  const updatedInvoiceDetails = {
    shipping: {
      name: patientName,
      address: patientAddress,
      city: patientCity,
      state: patientState,
      country: patientCountry,
      postal_code: patientPostalCode,
    },
    items,
    subtotal,
    invoice_nr,
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

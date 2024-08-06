import { Router } from "express";
import { checkSchema, validationResult } from "express-validator";
import { patientSchema } from "../utils/validationSchemas.mjs";

const router = Router();
const staticPatients = [
  {
    name: "John",
    dob: "1990-01-01",
    gender: "male",
    contactNo: "9811888811",
    emergencyContactNo: "9811981122",
    sessionPrice: 1000,
  },
  {
    name: "Jane",
    dob: "1990-01-01",
    gender: "female",
    contactNo: "9811888811",
    emergencyContactNo: "9811981122",
    sessionPrice: 1000,
  },
  {
    name: "Tom",
    dob: "1990-01-01",
    gender: "male",
    contactNo: "9811888811",
    emergencyContactNo: "9811981122",
    sessionPrice: 1000,
  },
  {
    name: "Mary",
    dob: "1990-01-01",
    gender: "female",
    contactNo: "9811888811",
    emergencyContactNo: "9811981122",
    sessionPrice: 1000,
  },
];
router.get("/", (req, res) => {
  res.send(staticPatients);
});

router.post("/", checkSchema(patientSchema), (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(400).json({
      errors: result.array(),
      message: "Validation failed",
    });
  }
  //staticPatients.push(patient);
  res.send(staticPatients);
});

router.put("/:id", checkSchema(patientSchema), (req, res) => {
  const parsedId = parseInt(req.params.id);
  console.log("parsedId", parsedId);
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(400).json({
      errors: result.array(),
      message: "Validation failed",
    });
  }
  //staticPatients.push(patient);
  res.send(staticPatients);
});
router.delete("/:id", (req, res) => {
  const parsedId = parseInt(req.params.id);
  console.log("parsedId", parsedId);
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(400).json({
      errors: result.array(),
      message: "Validation failed",
    });
  }
  //staticPatients.push(patient);
  res.send(staticPatients);
});
export default router;

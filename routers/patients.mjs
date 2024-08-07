import { Router } from "express";
import { checkSchema, validationResult } from "express-validator";
import { patientSchema } from "../utils/validationSchemas.mjs";
import Patient from "../mongoose/userSchema.mjs";

const router = Router();
const staticPatients = [
  {
    name: "John",
    dob: "1990-01-01",
    gender: "male",
    contactNo: "9811888811",
    emergencyContact: {
      name: "John",
      number: "9811888811",
      relationshipWithPatient: "father",
    },
    sessionPrice: 1000,
  },
  {
    name: "Jane",
    dob: "1990-01-01",
    gender: "female",
    contactNo: "9811888811",
    emergencyContact: {
      name: "Jane",
      number: "9811888811",
      relationshipWithPatient: "mother",
    },
    sessionPrice: 1000,
  },
  {
    name: "Tom",
    dob: "1990-01-01",
    gender: "male",
    contactNo: "9811888811",
    emergencyContact: {
      name: "Tom",
      number: "9811888811",
      relationshipWithPatient: "son",
    },
    sessionPrice: 1000,
  },
  {
    name: "Mary",
    dob: "1990-01-01",
    gender: "female",
    contactNo: "9811888811",
    emergencyContact: {
      name: "Mary",
      number: "9811888811",
      relationshipWithPatient: "daughter",
    },
    sessionPrice: 1000,
  },
];
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find();
    res.send(patients);
  } catch (err) {
    res.status(400).send({ message: "Error fetching patients", data: err });
  }
});
router.get("/:id", async (req, res) => {
  const parsedId = req.params.id;
  try {
    const patient = await Patient.findById(parsedId);
    res.send(patient);
  } catch (err) {
    res.status(400).send({ message: "Error fetching patient", data: err });
  }
});

router.post("/", checkSchema(patientSchema), async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(400).json({
      errors: result.array(),
      message: "Validation failed",
    });
  }
  const newPatient = new Patient(req.body);
  try {
    const savedPatient = await newPatient.save();
    res
      .status(201)
      .send({ message: "Patient created successfully", data: savedPatient });
  } catch (err) {
    res.status(400).send({ message: "Error creating patient", data: err });
  }
});

router.put("/:id", checkSchema(patientSchema), async (req, res) => {
  const parsedId = req.params.id;
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(400).json({
      errors: result.array(),
      message: "Validation failed",
    });
  }
  try {
    const editedPatient = await Patient.findByIdAndUpdate(parsedId, req.body, {
      new: true,
    });
    res.send({ message: "Patient updated successfully", data: editedPatient });
  } catch (err) {
    res.status(400).send({ message: "Patient not found", data: err });
  }
});
router.delete("/:id", async (req, res) => {
  const parsedId = req.params.id;
  try {
    const deletedPatient = await Patient.findByIdAndDelete(parsedId);
    res.send({ message: "Patient deleted successfully", data: deletedPatient });
  } catch (err) {
    res.status(400).send({ message: "Patient not found", data: err });
  }
});
export default router;

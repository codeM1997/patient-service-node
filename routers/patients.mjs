import { Router } from "express";
import { checkSchema, validationResult } from "express-validator";
import { patientSchema } from "../utils/validationSchemas.mjs";
import Patient from "../mongoose/patientSchema.mjs";
import socket from "../index.mjs";
const router = Router();

router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find();
    return res.send(patients);
  } catch (err) {
    return res
      .status(400)
      .send({ message: "Error fetching patients", data: err });
  }
});
router.get("/:id", async (req, res) => {
  const parsedId = req.params.id;
  try {
    const patient = await Patient.findById(parsedId);
    return res.send(patient);
  } catch (err) {
    return res
      .status(400)
      .send({ message: "Error fetching patient", data: err });
  }
});

router.post("/", checkSchema(patientSchema), async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({
      errors: result.array(),
      message: "Validation failed",
    });
  }
  const newPatient = new Patient(req.body);
  try {
    const savedPatient = await newPatient.save();
    socket.emit("patient-created", savedPatient);
    console.log('????');

    return res
      .status(201)
      .send({ message: "Patient created successfully", data: savedPatient });
  } catch (err) {
    return res
      .status(400)
      .send({ message: "Error creating patient", data: err });
  }
});

router.put("/:id", checkSchema(patientSchema), async (req, res) => {
  const parsedId = req.params.id;
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({
      errors: result.array(),
      message: "Validation failed",
    });
  }
  try {
    const editedPatient = await Patient.findByIdAndUpdate(parsedId, req.body, {
      new: true,
    });
    return res.send({ message: "Patient updated successfully", data: editedPatient });
  } catch (err) {
    return res.status(400).send({ message: "Patient not found", data: err });
  }
});
router.delete("/:id", async (req, res) => {
  const parsedId = req.params.id;
  try {
    const deletedPatient = await Patient.findByIdAndDelete(parsedId);
    return res.send({ message: "Patient deleted successfully", data: deletedPatient });
  } catch (err) {
    return res.status(400).send({ message: "Patient not found", data: err });
  }
});
export default router;

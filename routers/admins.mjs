/* create a router for admins, with POST , GET, PUT, DELETE methods */
import { Router } from "express";
import { checkSchema, validationResult } from "express-validator";
import { adminSchema } from "../utils/validationSchemas.mjs";
import Admin from "../mongoose/adminSchema.mjs";
import { hashPassword } from "../utils/helpers.mjs";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const admins = await Admin.find();
    return res.send(admins);
  } catch (err) {
    return res
      .status(400)
      .send({ message: "Error fetching admins", data: err });
  }
});
router.get("/:id", async (req, res) => {
  const parsedId = req.params.id;
  try {
    const admin = await Admin.findById(parsedId);
    return res.send(admin);
  } catch (err) {
    return res.status(400).send({ message: "Error fetching admin", data: err });
  }
});

router.post("/", checkSchema(adminSchema), async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({
      errors: result.array(),
      message: "Validation failed",
    });
  }
  const newAdmin = new Admin({
    ...req.body,
    password: hashPassword(req.body.password),
  });
  try {
    const savedAdmin = await newAdmin.save();
    return res
      .status(201)
      .send({ message: "Admin created successfully", data: savedAdmin });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: "Error creating admin", data: err });
  }
});

router.put("/:id", checkSchema(adminSchema), async (req, res) => {
  const parsedId = req.params.id;
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({
      errors: result.array(),
      message: "Validation failed",
    });
  }
  try {
    const editedAdmin = await Admin.findByIdAndUpdate(parsedId, req.body, {
      new: true,
    });
    return res.send({
      message: "Admin updated successfully",
      data: editedAdmin,
    });
  } catch (err) {
    return res.status(400).send({ message: "Admin not found", data: err });
  }
});
router.delete("/:id", async (req, res) => {
  const parsedId = req.params.id;
  try {
    const deletedAdmin = await Admin.findByIdAndDelete(parsedId);
    return res.send({
      message: "Admin deleted successfully",
      data: deletedAdmin,
    });
  } catch (err) {
    return res.status(400).send({ message: "Admin not found", data: err });
  }
});
export default router;

import { Router } from "express";
import patients from "./patients.mjs";
import admins from "./admins.mjs";
const router = Router();
router.use("/patients", patients);
router.use("/admins", admins);
export default router;

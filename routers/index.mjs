import {Router} from 'express';
import patients from './patients.mjs';
const router = Router();
router.use('/patients', patients);
export default router;
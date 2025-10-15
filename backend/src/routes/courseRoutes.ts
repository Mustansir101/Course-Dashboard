import express from "express";
import {
  getCourses,
  getCourseModules,
  markModuleComplete,
  markModuleIncomplete,
  markAllModulesComplete,
} from "../controllers/courseController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();
// All routes require authentication
router.use(authenticateToken);

router.get("/", getCourses);
router.get("/:courseId", getCourseModules);
router.post("/modules/:moduleId/complete", markModuleComplete);
router.delete("/modules/:moduleId/complete", markModuleIncomplete);
router.post("/:courseId/complete-all", markAllModulesComplete);

export default router;

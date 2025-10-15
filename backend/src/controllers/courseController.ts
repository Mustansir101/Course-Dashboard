// src/controllers/courseController.ts
import { Response } from "express";
import { pool } from "../config/database";
import { AuthRequest } from "../middleware/auth";

export const getCourses = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    // Get all courses with module count and completion status
    const coursesQuery = `
      SELECT 
        c.id,
        c.title,
        c.description,
        CAST(COUNT(DISTINCT m.id) AS INTEGER) as total_modules,
        CAST(COUNT(DISTINCT umc.module_id) AS INTEGER) as completed_modules,
        CAST(
          CASE 
            WHEN COUNT(DISTINCT m.id) > 0 
            THEN ROUND((COUNT(DISTINCT umc.module_id)::numeric / COUNT(DISTINCT m.id)::numeric) * 100, 2)
            ELSE 0 
          END AS FLOAT
        ) as progress_percentage
      FROM courses c
      LEFT JOIN modules m ON c.id = m.course_id
      LEFT JOIN user_module_completion umc ON m.id = umc.module_id AND umc.user_id = $1
      GROUP BY c.id, c.title, c.description
      ORDER BY c.id
    `;

    const result = await pool.query(coursesQuery, [userId]);

    // Ensure numbers are parsed correctly
    const courses = result.rows.map((row) => ({
      ...row,
      total_modules: parseInt(row.total_modules),
      completed_modules: parseInt(row.completed_modules),
      progress_percentage: parseFloat(row.progress_percentage),
    }));

    res.json(courses);
  } catch (error) {
    console.error("Get courses error:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

export const getCourseModules = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const courseId = parseInt(req.params.courseId);

    // Get course with modules
    const courseQuery = `
      SELECT 
        c.id,
        c.title,
        c.description
      FROM courses c
      WHERE c.id = $1
    `;

    const courseResult = await pool.query(courseQuery, [courseId]);

    if (courseResult.rows.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    const course = courseResult.rows[0];

    // Get modules with completion status
    const modulesQuery = `
      SELECT 
        m.id,
        m.title,
        m.description,
        m.order_index,
        CASE WHEN umc.id IS NOT NULL THEN true ELSE false END as is_completed,
        umc.completed_at
      FROM modules m
      LEFT JOIN user_module_completion umc ON m.id = umc.module_id AND umc.user_id = $1
      WHERE m.course_id = $2
      ORDER BY m.order_index
    `;

    const modulesResult = await pool.query(modulesQuery, [userId, courseId]);

    res.json({
      ...course,
      modules: modulesResult.rows,
    });
  } catch (error) {
    console.error("Get course modules error:", error);
    res.status(500).json({ error: "Failed to fetch course modules" });
  }
};

export const markModuleComplete = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const moduleId = parseInt(req.params.moduleId);

    // Check if module exists
    const moduleCheck = await pool.query(
      "SELECT id FROM modules WHERE id = $1",
      [moduleId]
    );

    if (moduleCheck.rows.length === 0) {
      return res.status(404).json({ error: "Module not found" });
    }

    // Mark as complete (using ON CONFLICT to handle duplicates)
    await pool.query(
      `INSERT INTO user_module_completion (user_id, module_id) 
       VALUES ($1, $2) 
       ON CONFLICT (user_id, module_id) DO NOTHING`,
      [userId, moduleId]
    );

    res.json({ message: "Module marked as complete" });
  } catch (error) {
    console.error("Mark module complete error:", error);
    res.status(500).json({ error: "Failed to mark module as complete" });
  }
};

export const markModuleIncomplete = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const moduleId = parseInt(req.params.moduleId);

    await pool.query(
      "DELETE FROM user_module_completion WHERE user_id = $1 AND module_id = $2",
      [userId, moduleId]
    );

    res.json({ message: "Module marked as incomplete" });
  } catch (error) {
    console.error("Mark module incomplete error:", error);
    res.status(500).json({ error: "Failed to mark module as incomplete" });
  }
};

export const markAllModulesComplete = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.userId;
    const courseId = parseInt(req.params.courseId);

    // Get all module IDs for the course
    const modulesResult = await pool.query(
      "SELECT id FROM modules WHERE course_id = $1",
      [courseId]
    );

    if (modulesResult.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Course not found or has no modules" });
    }

    // Insert completion records for all modules
    const moduleIds = modulesResult.rows.map((row) => row.id);

    for (const moduleId of moduleIds) {
      await pool.query(
        `INSERT INTO user_module_completion (user_id, module_id) 
         VALUES ($1, $2) 
         ON CONFLICT (user_id, module_id) DO NOTHING`,
        [userId, moduleId]
      );
    }

    res.json({ message: "All modules marked as complete" });
  } catch (error) {
    console.error("Mark all modules complete error:", error);
    res.status(500).json({ error: "Failed to mark all modules as complete" });
  }
};

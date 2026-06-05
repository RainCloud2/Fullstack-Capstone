import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "studysync_secret_key";

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

async function runOptionalSetup(taskName, callback) {
  try {
    await callback();
  } catch (error) {
    console.warn(`${taskName} skipped: ${error.message}`);
  }
}

async function createDefaultProgress(userId) {
  await runOptionalSetup("Default progress", async () => {
    const existing = await pool.query(
      "SELECT id FROM user_progress WHERE user_id = $1",
      [userId]
    );

    if (existing.rows.length > 0) {
      return;
    }

    const defaultPhases = [
      { id: "fondasi-web", progress: 0, status: "Belum dimulai" },
      { id: "javascript", progress: 0, status: "Terkunci" },
      { id: "react-ekosistem", progress: 0, status: "Terkunci" },
      { id: "career-preparation", progress: 0, status: "Terkunci" },
    ];

    await pool.query(
      `
      INSERT INTO user_progress(
        user_id,
        total_progress,
        completed_lessons,
        total_lessons,
        completed_quizzes,
        average_score,
        phases
      )
      VALUES($1, $2, $3, $4, $5, $6, $7)
      `,
      [userId, 0, 0, 40, 0, 0, JSON.stringify(defaultPhases)]
    );
  });
}

async function createDefaultStreak(userId) {
  await runOptionalSetup("Default streak", async () => {
    await pool.query(
      `
      INSERT INTO user_streaks(user_id, streak_days, last_login_date)
      VALUES($1, 1, CURRENT_DATE)
      ON CONFLICT(user_id) DO NOTHING
      `,
      [userId]
    );
  });
}

async function recordLogin(userId) {
  await runOptionalSetup("Login history", async () => {
    await pool.query(
      `
      INSERT INTO login_history(user_id)
      VALUES($1)
      `,
      [userId]
    );
  });
}

async function getUserStreak(userId) {
  await createDefaultStreak(userId);

  try {
    const result = await pool.query(
      `
      SELECT streak_days, last_login_date
      FROM user_streaks
      WHERE user_id = $1
      `,
      [userId]
    );

    return result.rows[0] || {
      streak_days: 1,
      last_login_date: null,
    };
  } catch {
    return {
      streak_days: 1,
      last_login_date: null,
    };
  }
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Nama, email, dan password wajib diisi",
      });
    }

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        error: "Email sudah terdaftar",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users(name, email, password)
      VALUES($1, $2, $3)
      RETURNING id, name, email, created_at
      `,
      [name, email, hashedPassword]
    );

    const user = result.rows[0];

    await createDefaultProgress(user.id);
    await createDefaultStreak(user.id);

    return res.status(201).json({
      message: "Register berhasil",
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal server error",
      detail: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email dan password wajib diisi",
      });
    }

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: "Email atau password salah",
      });
    }

    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Email atau password salah",
      });
    }

    await createDefaultProgress(user.id);
    await createDefaultStreak(user.id);
    await recordLogin(user.id);

    const streak = await getUserStreak(user.id);
    const token = generateToken(user);

    return res.status(200).json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
        streakDays: Number(streak.streak_days || 1),
        lastLoginDate: streak.last_login_date,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal server error",
      detail: error.message,
    });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const streak = await getUserStreak(req.user.id);

    return res.status(200).json({
      user: {
        ...req.user,
        streakDays: Number(streak.streak_days || 1),
        lastLoginDate: streak.last_login_date,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal server error",
      detail: error.message,
    });
  }
});

router.get("/login-history", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT id, user_id, login_time
      FROM login_history
      WHERE user_id = $1
      ORDER BY login_time DESC
      `,
      [req.user.id]
    );

    return res.status(200).json({
      data: result.rows,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal server error",
      detail: error.message,
    });
  }
});

export default router;

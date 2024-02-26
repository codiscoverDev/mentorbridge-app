const { Router } = require('express');
const authController = require('../controllers/authController');
const router = Router();

router.post('/student/login', authController.student_login);
router.post('/student/signup', authController.student_signup);
router.post('/mentor/login', authController.mentor_login);
router.post('/mentor/signup', authController.mentor_signup);

module.exports = router;


/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication operations
 */

/**
 * @swagger
 * /api/auth/student/login:
 *   post:
 *     summary: Login as a student
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             example:
 *               studentId: "65dc37dd6efca48c5c6aae48"
 *               token: "3GaUMjrJN65A2cmicKm34413i3dYX728ixgwKDzXc084fEQT76dzVTXjSd00u1ZuHSZgAl2INfO5327is5DKFrl8p5nAFX3GIG0xdvetmUloWqA9Wp76hSBwrWNnpQH9"
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/auth/student/signup:
 *   post:
 *     summary: Signup as a student
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rollNo:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               gender:
 *                 type: string
 *               year:
 *                 type: string
 *               branch:
 *                 type: string
 *               sec:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successful signup
 *         content:
 *           application/json:
 *             example:
 *               studentId: "65dc37dd6efca48c5c6aae48"
 *               token: "3GaUMjrJN65A2cmicKm34413i3dYX728ixgwKDzXc084fEQT76dzVTXjSd00u1ZuHSZgAl2INfO5327is5DKFrl8p5nAFX3GIG0xdvetmUloWqA9Wp76hSBwrWNnpQH9"
 *       400:
 *         description: Invalid request body
 *       409:
 *         description: User already exists
 */

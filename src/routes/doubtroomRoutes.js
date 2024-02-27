const { Router } = require('express');
const doubtController = require('../controllers/doubtRoomController');
const router = Router();

router.post('/', doubtController.createDoubtRoom);
router.post('/enroll', doubtController.enrollStudent);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: DoubtRoom
 *   description: DoubtRoom-related operations
 */

/**
 * @swagger
 * /api/doubtroom:
 *   post:
 *     summary: Create a DoubtRoom
 *     tags: [DoubtRoom]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               mentorId:
 *                 type: string
 *               mentorName:
 *                 type: string
 *               topics:
 *                 type: array
 *                 items:
 *                   type: string
 *               subject:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               enrolledStudentsId:
 *                 type: array
 *                 items:
 *                   type: string
 *               enrollmentCount:
 *                 type: number
 *               enrollmentDeadline:
 *                 type: string
 *                 format: date
 *               venue:
 *                 type: string
 *               scheduledTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: DoubtRoom created successfully
 *         content:
 *           application/json:
 *             example:
 *               doubtRoomId: "65dc37dd6efca48c5c6aae48"
 *       400:
 *         description: Invalid request body
 *       404:
 *         description: Mentor not found
 */

/**
 * @swagger
 * /api/doubtroom/enroll:
 *   post:
 *     summary: Enroll a student in a DoubtRoom
 *     tags: [DoubtRoom]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doubtRoomId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Student enrolled successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Student enrolled successfully"
 *       404:
 *         description: DoubtRoom not found
 *       409:
 *         description: Student already enrolled
 */

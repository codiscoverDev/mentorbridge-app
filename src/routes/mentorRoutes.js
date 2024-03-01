const { Router } = require('express');
const mentorController = require('../controllers/mentorController');
const router = Router();

router.get('/', mentorController.getMentor);
router.get('/search/:name', mentorController.searchMentors);
router.get('/:id', mentorController.getMentorById);
router.post('/follow', mentorController.followMentor);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Mentor
 *   description: Mentor-related operations
 */

/**
 * @swagger
 * /api/mentor/search/{name}:
 *   get:
 *     summary: Search mentors by name
 *     tags: [Mentor]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful search
 *         content:
 *           application/json:
 *             example:
 *               mentors: [
 *                 { name: "Mentor1", email: "mentor1@example.com" },
 *                 { name: "Mentor2", email: "mentor2@example.com" }
 *               ]
 *       404:
 *         description: No mentors found
 */

/**
 * @swagger
 * /api/mentor/{id}:
 *   get:
 *     summary: Get mentor by ID
 *     tags: [Mentor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               mentor: {
 *                 name: "Mentor1",
 *                 email: "mentor1@example.com",
 *                 phone: "1234567890",
 *                 gender: "Male",
 *                 department: "Computer Science"
 *               }
 *       404:
 *         description: Mentor not found
 */

/**
 * @swagger
 * /api/mentor/follow:
 *   post:
 *     summary: Follow a mentor
 *     tags: [Mentor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mentorId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully followed the mentor
 *         content:
 *           application/json:
 *             example: { message: "Successfully followed the mentor" }
 *       404:
 *         description: Mentor not found
 *       409:
 *         description: Already following the mentor
 */

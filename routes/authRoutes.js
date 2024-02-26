const { Router } = require('express');
const authController = require('../controllers/authController');
const mentorController = require('../controllers/mentorController');
const doubtController = require('../controllers/doubtRoomController');
const router = Router();

router.post('/student/login', authController.student_login);
router.post('/student/signup', authController.student_signup);
router.post('/mentor/login', authController.mentor_login);
router.post('/mentor/signup', authController.mentor_signup);

router.get('/mentor/search/:name', mentorController.searchMentors);
router.get('/mentor/:id', mentorController.getMentorById);
router.post('/mentor/follow', mentorController.followMentor);

router.post('/doubtroom', doubtController.createDoubtRoom);
router.post('/doubtroom/enroll/', doubtController.enrollStudent);

module.exports = router;

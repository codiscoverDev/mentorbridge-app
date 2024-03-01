const { Router } = require('express');
const studentController = require('../controllers/studentController');
const router = Router();

router.get('/', studentController.getStudent);

module.exports = router;

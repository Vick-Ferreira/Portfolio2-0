const router = require('express').Router();
const Feedback = require('../models/feedbacks')
const feedbackController = require('../controller/feedbackController');

router.post('/', feedbackController.createFeedback);

module.exports = router;
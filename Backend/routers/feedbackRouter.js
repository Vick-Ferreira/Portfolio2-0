const router = require('express').Router();
const feedbackController = require('../controller/feedbackController')

router.post('/', feedbackController.createFeedback);

module.exports = router;
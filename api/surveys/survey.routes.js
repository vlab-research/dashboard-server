const router = require('express').Router();
const controller = require('./survey.controller');

router.post('/', controller.postOne);
router.get('/', controller.getBy, controller.getAll);
router.delete('/:id', controller.deleteOne);

module.exports = router;

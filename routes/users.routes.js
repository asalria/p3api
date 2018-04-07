const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users.controller');

router.post('/', usersController.create);
router.get('/', usersController.list);
router.get('/:id', usersController.listOne);
router.put('/:id', usersController.edit);


module.exports = router;
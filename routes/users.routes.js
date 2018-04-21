const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users.controller');
const secureMiddleware = require('../middleware/secure.middleware');

router.post('/', usersController.create);
router.get('/', secureMiddleware.isAuthenticated, usersController.list);
router.get('/:id', usersController.listOne);
router.put('/:id', usersController.edit);


module.exports = router;
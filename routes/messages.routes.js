const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messages.controller');
const messagesMiddleware = require('../middleware/routes.middleware');
const secureMiddleware = require('../middleware/secure.middleware');

router.get('/', secureMiddleware.isAuthenticated, messagesController.list);
router.get('/:id', secureMiddleware.isAuthenticated, messagesMiddleware.checkValidId, messagesController.get);
router.post('/', secureMiddleware.isAuthenticated, messagesController.create);
router.put('/:id', secureMiddleware.isAuthenticated, messagesController.edit);
router.delete('/:id', secureMiddleware.isAuthenticated, messagesMiddleware.checkValidId, messagesController.delete);

module.exports = router;
const express = require('express');
const router = express.Router();
//const uploadConfig = require('../configs/multer.config');
const routesController = require('../controllers/routes.controller');
const routesMiddleware = require('../middleware/routes.middleware');
const secureMiddleware = require('../middleware/secure.middleware');

router.get('/', secureMiddleware.isAuthenticated, routesController.list);
router.get('/:id', secureMiddleware.isAuthenticated, routesMiddleware.checkValidId, routesController.get);
router.post('/', secureMiddleware.isAuthenticated, routesController.create);
router.put('/:id', secureMiddleware.isAuthenticated, routesController.edit);
router.delete('/:id', secureMiddleware.isAuthenticated, routesMiddleware.checkValidId, routesController.delete);

module.exports = router;

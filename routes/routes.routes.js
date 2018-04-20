const express = require('express');
const router = express.Router();
//const uploadConfig = require('../configs/multer.config');
const routesController = require('../controllers/routes.controller');
const routesMiddleware = require('../middleware/routes.middleware');
const secureMiddleware = require('../middleware/secure.middleware');

router.get('/',  routesController.list);
router.get('/user/:id', routesController.listByUser);
router.get('/location/:search', routesController.listByLocation);
router.get('/:id', routesController.get);
router.post('/', secureMiddleware.isAuthenticated, routesController.create);
router.put('/:id', secureMiddleware.isAuthenticated, secureMiddleware.isAuthor, routesController.edit);
router.delete('/:id', secureMiddleware.isAuthenticated, secureMiddleware.isAuthor, routesController.delete);

module.exports = router;

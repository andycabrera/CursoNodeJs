var express = require('express');
var router = express.Router();
var usuariosController = require('../controllers/usuario');

router.get('/', usuariosController.list);
router.get('/create', usuariosController.create_get);
router.post('/create', usuariosController.create_post);
router.get('/:id/update', usuariosController.update_get);
router.post('/:id/update', usuariosController.update);
router.post('/:id/delete', usuariosController.delete);

module.exports = router;
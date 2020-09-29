var express = require('express');
var router = express.Router();
var usuarioController = require('../../controllers/api/usuarioControllerAPI');

router.get('/', usuarioController.usuarios_list);
router.post('/create', usuarioController.usuario_create);
router.get('/:id/create', usuarioController.usuario_create_get);
router.get('/:id/update', usuarioController.usuario_update_get);
router.post('/:id/update', usuarioController.usuario_update);
router.post('/reservar', usuarioController.usuario_reservar);

module.exports = router;

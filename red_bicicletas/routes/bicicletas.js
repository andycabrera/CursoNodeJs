var express = require('express');
var router = express.Router();
var bicicletaController = require("../controllers/bicicleta");

router.get('/', bicicletaController.bicicleta_list);
router.get('/create',bicicletaController.bicicleta_create_get);
router.post('/create',bicicletaController.bicicleta_create_post);

module.exports = router;
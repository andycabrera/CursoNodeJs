var Bicicleta = require('../models/bicicleta');

exports.bicicleta_list = function(req,res){
    res.render('bicicletas/index',{bicis: Bicicleta.allBicis});
}

exports.bicicleta_create_get = function(req,res){
    res.render('bicicletas/create');
}

exports.bicicleta_create_post = function(req,res){
    var bici = new Bicicleta(req.body.id , req.body.color, req.body.modelo);
    bici.ubicacion = [req.body.lat, req.body.lng];
    Bicicleta.add(bici);

    res.redirect('/bicicletas');
}
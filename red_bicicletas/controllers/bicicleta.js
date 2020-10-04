var Bicicleta = require('../models/bicicleta');

exports.bicicleta_list = function(req,res){
    Bicicleta.allBicis(function(error, bicis){
        if(error) console.log(error);
        res.render('bicicletas/index',{
            bicis: bicis
        });
    });
}

exports.bicicleta_create_get = function(req,res){
    res.render('bicicletas/create');
}

exports.bicicleta_create_post = function(req,res){
    var bici = new Bicicleta({
        code: req.body.code,
        color: req.body.color,
        modelo: req.body.modelo,
        ubicacion: [req.body.lat, req.body.lng]
    });

    Bicicleta.add(bici,function(err, newBici){
        res.status(200).json({
            bicicleta: newBici
        })
    });

    res.redirect('/bicicletas');
}

exports.bicicleta_delete_post = function(req, res){
    Bicicleta.deleteByCode(req.body.id);

    res.redirect('/bicicletas');
}

exports.bicicleta_update_get = function(req, res){
    var bici = Bicicleta.findById(req.params.id);
    
    res.render('bicicletas/update',{bici})
}

exports.bicicleta_update_post = function(req, res){
    var bici = Bicicleta.findById(req.params.id);

    bici.id = req.body.id;
    bici.color = req.body.color;
    bici.modelo = req.body.modelo;
    bici.ubicacion = [req.body.lat, req.body.lng];

    res.redirect('/bicicletas');

}
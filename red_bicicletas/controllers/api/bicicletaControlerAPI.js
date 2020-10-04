var Bicicleta =require('../../models/bicicleta');

exports.bicicleta_list = function(req, res){
    Bicicleta.allBicis(function(error, bicis){
        res.status(200).json({
            bicicletas: bicis
        });
    });
}

exports.bicicleta_create = function(req,res){
    var bici = new Bicicleta({code: req.body.code,
        color: req.body.color,
        modelo: req.body.modelo,
        ubicacion: [req.body.lat, req.body.lng]
    });

    Bicicleta.add(bici,function(err, newBici){
        res.status(200).json({
            bicicleta: newBici
        })
    });
}

exports.bicicleta_delete = function(req, res){
    Bicicleta.deleteByCode(req.body.code,function(err, targetBici){
        res.status(204).send();
    });
}

exports.bicicleta_update = function(req, res){
    Bicicleta.update(req.body ,function(err, targetBici){
        if(err) console.log(err);
        res.status(200).json({
            bicicleta: targetBici
        });
    });
}

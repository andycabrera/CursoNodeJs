var Usuario = require('../models/usuario');
var Token = require('../models/token');

module.exports ={
    configurationGet: function(req, res){
        Token.findOne({token: req.params.token}, function(err, token){
            if(!token) return res.status(400).send({ type: 'not-verified', msg: 'No se pudo verificar la cuenta. No encontramos un usuario con este token'});
            Usuario.findById(token._userId, function(err, usuario){
                if(!usuario) return res.status(400).send({ msg: 'No encontramos un usuario para este token'});
                if(usuario.verificado) return res.redirect('/usuarios');
                usuario.verificado = true;
                usuario.save(function(err){
                    if(err) { return res.status(500).send({ msg: err.message }); }
                    res.redirect('/');
                });
            });
        });
    },
}
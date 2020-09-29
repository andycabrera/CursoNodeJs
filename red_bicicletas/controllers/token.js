var Usuario = require('usuario');
var Token = require('token');

module.exports ={
    configurationGet: function(req, res){
        Token.findOne({token: req.params.token}, function(err, token){
            
        })
    }
}
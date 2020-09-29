var Usuario = require('usuario');

module.exports = {
    list: function(req, res){
        Usuario.find({}, function(error, usuarios){
            res.render('usuarios/index', { usuarios: usuarios});
        });
    },

    update_get: function(req, res){
        Usuario.findById(req.params.id, function(err, usuario){
            res.render('usuarios/update', {errors:{}, usuario: usuario});
        });
    },

    update: function(req, res, next){
        var update_values = { nombre: req.body.nombre};
        Usuario.findByIdAndUpdate(req.params.id, update_values,function(err, usuario){
            if(err){
                console.log(err);
                res.render('usuarios/update', {errors: err.errors, usuario: new Usuario({nombre: req.body.nomrbe, email:req.body.email})});
            }else{
                res.redirect('/usuarios');
                return;
            }
        });
    },

    create_get: function(req, res){
        res.render('/usuarios/create', {errors:{}, usuario: new Usuario()});
    },

    create_post: function(req, res){
        if (req.body.password != req.body.confirm_password){
            res.render('/usuarios/create', {errors:{confirm_password: {massage: 'No coinciden las contraseñas ingresadas'}}, usuario: new Usuario({nombre: req.body.nombre, email: req.body.email})});
            return;
        }

        Usuario.create({nombre: req.body.nombre, email: req.body.email, password: req.body.email }, function(err, nuevoUsuario){
            nuevoUsuario.enviar_email_bienvenida();
            res.redirect('/usuarios');
        });
    },

    delete: function(req, res){
        Usuario.findByIdAndDelete(req.params.id, function(err){
            if (err)
                next(err);
            else
                res.redirect('/usuarios');
        });
    }
}
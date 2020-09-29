var mongoose = require('mongoose');
var Reserva = require('./reserva');
var Schema = mongoose.Schema;

const bcrypt =require('bcrypt');
const saltRounds = 10;

const validateEmail = function(email){
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

var usuarioSchema = new Schema({
    nombre: {
        type: String,
        trim: true,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String, 
        trim: true,
        required: [true, 'El email es obligatorio'],
        lowercase: true,
        validate: [validateEmail, 'Por favor, ingrese un email valido'],
        match: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/]
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio']
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    verificado: {
        type: Boolean,
        defoult: false
    }
});

usuarioSchema.pre('save', function(next){
    if (this.password.isModified('password')){
        this.password = bcrypt.hashSync(this.password, saltRounds);
    }
    next();
});

usuarioSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

usuarioSchema.methods.reservar = function(biciId, desde, hasta, cb){
    var reserva = new Reserva({usuario: this.id, bicicleta: biciId, desde:desde, hasta: hasta});
    reserva.save(cb);
}

module.exports = mongoose.model('Usuario', usuarioSchema);
var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
var Reserva = require('./reserva');
var Schema = mongoose.Schema;
var Token = require('../models/token');

const crypto =require('crypto');
const mailer = require('../mailer/mailer');
const bcrypt =require('bcrypt');
const { defaultMaxListeners } = require('stream');
const { MailMessage } = require('../mailer/mailer');
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
    googleId: String,
    facebookId: String,
    email: {
        type: String, 
        trim: true,
        required: [true, 'El email es obligatorio'],
        lowercase: true,
        unique:true,
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

usuarioSchema.plugin(uniqueValidator, {message : 'El {PATH} ya existe con otro usuario.'});

usuarioSchema.pre('save', function(next){
    if (this.isModified('password')){
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

usuarioSchema.methods.enviar_email_bienvenida = function(cb){
    const token = new Token({ _userId: this.id, token: crypto.randomBytes(16).toString('hex')});
    const email_destination = this.email;
    token.save(function(err){
        if(err){return console.log(err.message);}
    
        const mailOptions = {
            from: 'no-reply@redbicicletas.com',
            to: email_destination,
            subject: 'Verificacion de cuenta',
            text: 'Hola,\n\n' + 'Por favor, para verificar su cuenta haga click en este link: \n' + 'http://localhost:3000' + '\/token/confirmation\/' + token.token + '.\n'
        };

        mailer.sendMail(mailOptions, function(err){
            if(err) { return console.log(err.message)}

            console.log('A verfication email has been sent to' + email_destination + '.');
        })
    });
}

usuarioSchema.methods.resetPassword = function(cb){
    const token = new Token({_userId: this.id, token: crypto.randomBytes(16).toString('hex')});
    const email_destination = this.email;
    token.save(function(err){
        if(err) {return cb(err)}

        const mailOptions = {
            from: 'no-reply@redbicicletas.com',
            to: email_destination,
            subject: 'Reseteo de password de cuenta ',
            text: 'Hola, \n\n' + 'Por favor, para resetar el password de su cuenta haga click en este link: \n' + 'http://localhost:3000' + '\/resetPassword\/' + token.token +'.\n'
        };

        mailer.sendMail(mailOptions, function(err){
            if(err) { return cb(err);}

            console.log('Se envio un email para resetear el password a : ' + email_destination + '.');
        });
        cb(null);
    });
}

usuarioSchema.statics.findOneOrCreateByGoogle = function findOneOrCreate (condition, callback){
    const self = this;
    console.log(condition);
    self.findOne({
        $or: [
            {'googleId': condition.id}, { 'email': condition.emails[0].value}
        ]
    }, (err, result) => {
        if(result) {
            callback(err, result)
        }else {
            console.log('------------------- CONDITION -------------------');
            console.log(condition);
            let values = {};
            values.googleId = condition.id;
            values.email = condition.emails[0].value;
            values.nombre = condition.displayName || 'SIN NOMBRE';
            values.verificado = true;
            // values.password = condition._json.etag;
            values.password = crypto.randomBytes(16).toString('hex');
            console.log('------------------- VALUES -------------------');
            console.log(values);
            self.create(values, (err, result) => {
                if(err) {console.log(err);}
                return callback(err, result)
            })
        }
    })  
};

userSchema.statics.findOneOrCreateByFacebook = function findOneOrCreate(condition, callback) {
    const self = this;

    this.findOne({
        $or: [
            { 'facebookId': condition.id },
            { 'email': condition.emails[0].value }
        ]
    }, 
    (err, result) => {
        if (result) {
            callback(err, result);
        } else {
            let values = {};

            values.facebookId = condition.id;
            values.email = condition.emails[0].value;
            values.nombre = condition.displayName || '';
            values.verified = true;
            values.password = crypto.randomBytes(16).toString('hex');

            self.create(values, function (err, user) {
                if (err) {
                    console.log(err);
                }
                return callback(err, user);
            });
        }
    });
}

module.exports = mongoose.model('Usuario', usuarioSchema);
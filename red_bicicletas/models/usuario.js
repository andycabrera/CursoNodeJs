var mongoose = require('mongoose');
var Reserva = require('./reserva');
var Schema = mongoose.Schema;

var usuarioSchema = new Schema({
    nombre: String,
});

usuarioSchema.methods.reservar = function(biciId, desde, hasta, cb){
    var reserva = new Reserva({usuario: this.id, bicicleta: biciId, desde:desde, hasta: hasta});
    reserva.save(cb);
}

module.exports = mongoose.model('Usuario', usuarioSchema);
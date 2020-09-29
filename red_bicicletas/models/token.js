var  mongoose = require('mongoose');
var Usuario = require('usuario');
var Schema = mongoose.Schema;

var tokenSchema = new Schema({
    id: Long,
    usuario: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario'
    },
    fecha: Date
});


module.exports = mongoose.model('Token', tokenSchema); 
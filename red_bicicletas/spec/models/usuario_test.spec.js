var mongoose = require('mongoose');
var Bicicleta = require('../../models/bicicleta');
var Usuario = require('../../models/usuario');
var Reserva = require('../../models/reserva');

describe('Testing Bicicletas', function(){
    beforeAll(function(done){
        var mongoDB = 'mongodb://localhost/testdb';
        mongoose.connect(mongoDB,{ useNewUrlParser:true, useUnifiedTopology: true });

        const db = mongoose.connection;
        db.on('error',console.error.bind(console, 'connection error'));
        db.once('open', function(){
            console.log('We are connected to test database');
            done();
        });
    });

    afterEach(function(done) {
        Bicicleta.deleteMany({}, function(error, success){
            if (error) console.log(error);
            Usuario.deleteMany({},function(error, succes){
                if (error) console.log(error);
                Reserva.deleteMany({}, function(error, success){
                    if (error) console.log(error);
                    done();
                })
            });
        });
    });

    describe('Cuando un Usuario reserva una bici', () => {
        it('desde existir la reserva', (done) => {
            const usuario = new Usuario({nombre: 'andy'});
            usuario.save();

            const bicicleta = new Bicicleta({ code: 1, color: "amarillo",modelo: "urbana"});
            bicicleta.save();

            var hoy = new Date();
            var mañana = new Date();
            mañana.setDate(hoy.getDate() +1);
            usuario.reservar(bicicleta.id, hoy, mañana, function(err, reserva){
                Reserva.find({}).populate('bicicleta').populate('usuario').exec(function(err, reservas){
                    console.log(reservas[0]);
                    expect(reservas.length).toBe(1);
                    expect(reservas[0].diasDeReserva()).toBe(2);
                    expect(reservas[0].bicicleta.code).toBe(1);
                    expect(reservas[0].usuario.nombre).toBe(usuario.nombre);
                    done();
                })
            })
        })
    });

});
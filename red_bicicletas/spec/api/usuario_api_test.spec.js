var mongoose = require('mongoose');
var Usuario = require('../../models/usuario');
var request = require('request');
var server = require('../../bin/www');

const url_base = 'http://localhost:3000/api/usuarios'

describe('TEST USUARIOS API', () => {
    beforeAll(function(done){
        mongoose.connection.close().then(() => {
            var mongoDB = 'mongodb://localhost/testdb';
            mongoose.connect(mongoDB, { useNewUrlParser : true, useUnifiedTopology: true });

            var db = mongoose.connection;

            db.on('error', console.error.bind(console, 'Error en la conexion de la Base de Datos'));
            db.once('open', function(){
                console.log('We are connected to the database');
                done();
            });
        });
    });

    afterEach(function(done){
        Usuario.deleteMany({},function(err, succes){
            if(err) console.log(err);
            done();
        });
    });

    describe('Usuarios.GET', () => {
        it('Me debe devolver todos los usuarios', (done) => {
            request.get(url_base, function(req, response, body){
                var result = JSON.parse(body);
                expect(response.statusCode).toBe(200);
                expect(result.usuarios.length).toBe(0);
                done();
           });

        })
    });

    // describe('Usuarios.POST', () => {
    //     it('Crear un nuevo usuario', (done){
            
    //     })
    // })
        
});
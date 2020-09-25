var mongoose = require('mongoose');
var Bicicleta = require('../../models/bicicleta');

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
            done();
        });
    });

    describe('Bicicleta.createInstance', () => {
        it('crea una instancia de la Bicicleta', () => {
            var bici = Bicicleta.createInstance(1, "verde", "urbana", [-3.25,-56.2]);

            expect(bici.code).toBe(1);
            expect(bici.color).toBe("verde");
            expect(bici.modelo).toBe("urbana");
            expect(bici.ubicacion[0]).toBe(-3.25);
            expect(bici.ubicacion[1]).toBe(-56.2);
        });
    });

    describe('Bicicleta.allBicis', () => {
        it('comienza vacia', (done) => {
            Bicicleta.allBicis(function(err, bicis){
                expect(bicis.length).toBe(0);
                done();
            });
        });
    });

    describe('Bicicleta.add', () => {
        it('agregar solo una bici', (done) => {
            var aBici = new Bicicleta({code: 1, color: "verde", modelo: "urbana"});
            Bicicleta.add(aBici, function(err, newBici){
                if (err) console.log(err);
                Bicicleta.allBicis(function(err, bicis){
                    expect(bicis.length).toEqual(1);
                    expect(bicis[0].code).toEqual(aBici.code);
                    done();
                });
            });
        });
    });

    describe('Bicicleta.findeByCode', () => {
        it('devuelve una bicicleta por el codigo', (done) => {
            Bicicleta.allBicis(function(err, bicis){
                expect(bicis.length).toBe(0);

                var bici1 = new Bicicleta({code: 1, color: "verde", modelo: "urbana"});
                Bicicleta.add(bici1, function(err, newBici){
                    if (err) console.log(err);

                    var bici2 = new Bicicleta({code: 2, color: "azul", modelo: "urbana"});
                    Bicicleta.add(bici2, function(err, newBici){
                        if (err) console.log(err);

                        Bicicleta.findByCode(1, function(error, targetBici){
                            expect(targetBici.code).toBe(bici1.code);
                            expect(targetBici.color).toBe(bici1.color);
                            expect(targetBici.modelo).toBe(bici1.modelo);

                            done();
                        });
                    });
                });
            });
        });
    });

    describe('Bicicleta.deleteByCode', () => {
        it('eliminar una bici por su code', (done) => {
            Bicicleta.allBicis(function(err, bicis){
                expect(bicis.length).toBe(0);

                var aBici = new Bicicleta({code:34, color: "amarillo", modelo: "montaña"});
                Bicicleta.add(aBici, function(error, newBici){
                    if (error) console.log(error);
                    Bicicleta.allBicis(function(err, bicicletas){
                        expect(bicicletas.length).toBe(1)
                    })

                    Bicicleta.deleteByCode(aBici.code, function(err, target){
                        if (err) console.log(err);
                        expect(bicis.length).toBe(0);

                        done();
                    });
                });
            });
        });
    });

});
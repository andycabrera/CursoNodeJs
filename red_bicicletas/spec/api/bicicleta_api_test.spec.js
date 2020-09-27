var mongoose = require('mongoose');
var Bicicleta = require('../../models/bicicleta');
var request = require('request');
var server = require('../../bin/www');

var base_url = 'http://localhost:3000/api/bicicletas';


describe('Bicicleta API', () => {
    beforeAll(function (done) {

        mongoose.connection.close().then(() => {
            var mongoDB = 'mongodb://localhost/testdb';
            mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
            
            var db = mongoose.connection;

            db.on('error', console.error.bind(console, 'MongoDB connection error: '));
            db.once('open', function () {

                console.log('We are connected to test database!');
                done();

            });
        });
    });

    afterEach(function(done) {
        Bicicleta.deleteMany({}, function(error, success){
            if (error) console.log(error);
            done();
        });
    });

    describe('GET BICICLETAS /', () => {
        it('Status 200', (done) => {
            request.get(base_url, function(error, response, body){
                var result = JSON.parse(body);
                expect(response.statusCode).toBe(200);
                expect(result.bicicletas.length).toBe(0);
                done();
            });
        });
    });

    describe('POST BICICLETAS /create', () => {
        it("Status 200", (done) => {
            var headers = { 'content-type': 'application/json' };
            var aBici = '{"code":10, "color":"rojo", "modelo":"urbana", "lat":-34, "lng":-54}';
            request.post({
                headers: headers,
                url: base_url + '/create',
                body: aBici
            }, function (error, response, body) {
                expect(response.statusCode).toBe(200);
                var result = JSON.parse(body);
                expect(result.bicicleta.color).toBe('rojo');
                expect(result.ubicacion[0]).toBe(-34);
                expect(result.ubicacion[1]).toBe(-54);
                done();
            });
        });
    });

    describe('DELETE Bicicleta/delete', () => {
        it('Status 204', (done) => {
            var a = Bicicleta.createInstance(1, 'negro', 'urbana', [-34.5,-96.2]);
            Bicicleta.add(a, function(err, newBici){
                var headers = { 'content-type': 'application/json' };
                var aBici = '{"code":10}';
                request.delete({
                    headers: headers,
                    url: base_url + '/delete',
                    body: aBici
                }, function (error, response) {
                    expect(response.statusCode).toBe(204);
                    done();
                });
            })

        });
    });

    // describe('POST Bicicleta /update', () => {
    //     it('Status 200', function (done) {
    //         var bici = new Bicicleta({"code":10, "color":"rojo", "modelo":"urbana", "lat":-34, "lng":-54});
    //         Bicicleta.add(bici, function(err, newBici){
    //             request.post(base_url+'/10/update',{"code":10, "color":"rojo", "modelo":"urbana", "lat":-34, "lng":-54}
    //                 , function (error, response, body) {
    //                     Bicicleta.allBicis(function(err, bicis){
    //                         expect(bicis.length).toBe(2);
    //                         expect(response.statusCode).toBe(200);
    //                         done();
    //                     });
    //                 });
    //         });
    //     });
    // });
});
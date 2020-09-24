var Bicicleta = require('../../models/bicicleta');
var request = require('request');
var server = require('../../bin/www');

describe('Bicicleta API', () => {
    describe('GET BICICLETAS /', () => {
        it('Status 200', () => {
            expect(Bicicleta.allBicis.length).toBe(0);

            var a = new Bicicleta(1 , "negro", "urbana", [-5.1,-58.6]);
            Bicicleta.add(a);

            request.get('http://localhost:3000/api/bicicletas', function(error, response, body){
                expect(response.statusCode).toBe(200);
            });
        });
    });

    describe('POST Bicicleta /create', () => {
        it('Status 200', (done) => {
            var headers = {'content-type' : 'application/json'};
            var aBici = '{ "id":2 ,"color": "rojo", "modelo": "urbana", "lat": -34.628565, "lng": -58.509514 }';
            request.post({
                hedears: headers,
                url:    'http://localhost:3000/api/bicicletas/create',
                body:   aBici
             }, function(error, response, body){
                    expect(response.statusCode).toBe(200);
                    expect(Bicicleta.allBicis.length).toBe(2);
                    expect(Bicicleta.findById(2).color).toBe("rojo");
                    done();
            });
    
        });
    });
});
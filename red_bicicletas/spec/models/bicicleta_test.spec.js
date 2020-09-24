var Bicicleta = require('../../models/bicicleta');


beforeEach(() => {Bicicleta.allBicis = [];});
beforeAll(() => {console.log('testeando...');});
//TESTEAMOS 
describe('Bicicleta.allBicis', () => {
    it('comienza vacia', () => {
        expect(Bicicleta.allBicis.length).toBe(0);
    });
});

describe('Bicicleta.add', () => {
    it('agregamos una', () => {
        expect(Bicicleta.allBicis.length).toBe(0);

        var bici = new Bicicleta(3,"azul","ciudad");
        bici.ubicacion = [-56.232,-58.60];

        Bicicleta.add(bici);
        expect(Bicicleta.allBicis.length).toBe(1);
        expect(Bicicleta.allBicis[0]).toBe(bici);
    })
});

describe('Bicicleta.findById', () => {
    it('debe devolver la bici con id 1', () => {
        // Bicicleta.allBicis = [];
        expect(Bicicleta.allBicis.length).toBe(0);
        var aBici1 = new Bicicleta(1, "verde", "urbana");
        var aBici2 = new Bicicleta(2, "azul", "montaña");

        Bicicleta.add(aBici1);
        Bicicleta.add(aBici2);

        var targetBici = Bicicleta.findById(1);

        expect(targetBici.id).toBe(1);
        expect(targetBici.color).toBe(aBici1.color);
        expect(targetBici.modelo).toBe(aBici1.modelo);

    });
});

describe('Bicicleta.removeById', () => {
    it('eliminamos una bici', () => {
        var bici = new Bicicleta(4,"azul","urbana");

        Bicicleta.add(bici);
        expect(Bicicleta.allBicis.length).toBe(1);

        Bicicleta.removeById(bici.id);
        expect(Bicicleta.allBicis.length).toBe(0);
    })


})
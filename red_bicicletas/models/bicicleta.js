var Bicicleta = function(id, color, modelo, ubicacion){
    this.id =id;
    this.color = color;
    this.modelo = modelo;
    this.ubicacion = ubicacion;
}

Bicicleta.prototype.toString = function(){
    return 'id: '+ this.id + " | color: "+this.color;
}

Bicicleta.allBicis = [];
Bicicleta.add = function(unaBici){
    Bicicleta.allBicis.push(unaBici);
}

Bicicleta.findById = function(unaBiciId){
    var unaBici = Bicicleta.allBicis.find(x => x.id == unaBiciId);
    if(unaBici)
        return unaBici
    else
        throw new Error(`No existe una Bicicleta con el id ${unaBiciId}`);
}

Bicicleta.removeById = function(unaBiciId){
    for(var i = 0; i < Bicicleta.allBicis.length; i++){
        if(Bicicleta.allBicis[i].id == unaBiciId){
            Bicicleta.allBicis.splice(i, 1);
            break;
        }
    }
}

var a = new Bicicleta(1, 'rojo', 'urbana', [-34.6012424,-58.3861497]);
var b = new Bicicleta(2, 'azul', 'urbana', [-34.6012424,-58.380864]);

Bicicleta.add(a);
Bicicleta.add(b);

module.exports = Bicicleta;
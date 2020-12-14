var { Schema, model, SchemaTypes } = require('mongoose');

//definere indholdet i databasen, hvordan det skal opsættes
// navn og dataType
var Cheese = new Schema({
	name: SchemaTypes.String,
	price: SchemaTypes.Decimal128,
	weight: SchemaTypes.Number,
	strength: SchemaTypes.String,
	brand: SchemaTypes.String,
});

//hvad skal modelen hedde "cheese" og hvilken variable der skal eksporteres
//eksportere den så vi kan bruge den andre steder i koden
//collection bliver navngivet til flertal fx "Cheeses" i mongoDB
module.exports = model('Cheese', Cheese);

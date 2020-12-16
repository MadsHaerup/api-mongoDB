var Cheese = require('./cheese.model');
var auth = require('./auth-middleware');

module.exports = function (app) {
	//create cheese
	app.post('/api/v1/cheeses', auth, function (request, response, next) {
		try {
			var cheese = new Cheese({
				name: request.fields.name,
				price: request.fields.price,
				weight: request.fields.weight,
				strength: request.fields.strength,
				brand: request.fields.brand,
			});
			//køre save metoden på cheese
			cheese.save();
			response.status(201);
			response.json(cheese);
		} catch (error) {
			return next(error);
		}
	});

	// ────────────────────────────────────────────────────────────────────────────────

	//get all cheeses
	app.get('/api/v1/cheeses', async function (request, response, next) {
		//får fat i query stringen i url'en via express
		var limit = parseInt(request.query.limit) || 5;
		// ─────────────────────────────────────────────────────────────────
		// offset er = det der står i url'en eller 0
		var offset = parseInt(request.query.offset) || 0;

		try {
			// hent oste fra mongo DB
			//kan fortælle hvor mange resultater vi vil have af adgangen || default er sat til 5
			//offset bladre os ned på listen
			var result = await Cheese.find().limit(limit).skip(offset);
			//få det totale antal i count collection
			var count = (await Cheese.find()).length;

			var qLimit = request.query.limit;
			var qOffset = request.query.offset || 0;
			var queryStringNext = [];
			var queryStringPrevious = [];

			if (qLimit) {
				queryStringNext.push('limit=' + qLimit);
				queryStringPrevious.push('limit=' + qLimit);
			}
			queryStringNext.push('offset=' + (parseInt(qOffset) + limit));

			if (qOffset) {
				queryStringPrevious.push('offset=' + (parseInt(qOffset) - limit));
			}

			var baseUrl = `${request.protocol}://${request.hostname}:${request.hostname == 'localhost' ? ':' + process.env.PORT : ''}${request._parsedUrl.pathname}`;
			var output = {
				count,
				next: offset + limit < count ? `${baseUrl}?${queryStringNext.join('&')}` : null,
				//hvis offset er mere end null skal vi kunne bladre tilbage ellers
				previous: offset > 0 ? `${baseUrl}?${queryStringPrevious.join('&')}` : null,
				url: `${baseUrl}` + (offset ? 'offset=' + offset : ''),
				results: result,
			};
			// return response med output, total sider, og nuværende
			response.json(output);

			//fejl håndtering
		} catch (error) {
			return next(error);
		}
	});
	//get single cheese by id
	app.get('/api/v1/cheeses/:id', async function (request, response, next) {
		try {
			// hent en ost ud fra id
			var result = await Cheese.findById(request.params.id);

			//hvis osten ikke findes: fejl 404
			if (!result) {
				response.status(404);
				response.end();
				return;
			}
			//hvis osten findes
			response.json(result);

			//fejl håndtering
		} catch (error) {
			return next(error);
		}
	});
	//update a cheese
	//next er et callback, kendes som (cb, callback, next)
	app.patch('/api/v1/cheeses/:id', auth, async function (request, response, next) {
		try {
			var { name, price, weight, strength, brand } = request.fields;
			var updateObject = {};
			if (name) updateObject.name = name;
			if (price) updateObject.price = price;
			if (weight) updateObject.weight = weight;
			if (strength) updateObject.strength = strength;
			if (brand) updateObject.brand = brand;

			await Cheese.findByIdAndUpdate(request.params.id, updateObject);

			var cheese = await Cheese.findByIdAndUpdate(request.params.id);

			response.status(200);
			response.json(cheese);
		} catch (error) {
			return next(error);
		}
	});

	app.delete('/api/v1/cheeses/:id', auth, async function (request, response, next) {
		try {
			await Cheese.findByIdAndRemove(request.params.id);
			response.status(204);
			response.end();
		} catch (error) {
			return next(error);
		}
	});
};

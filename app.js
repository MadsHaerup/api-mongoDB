require('dotenv').config();
var express = require('express');
var app = express();
var formidable = require('express-formidable');
var cors = require('cors');
//configuration
require('./database');
app.use(cors());
app.use(formidable());
//route
require('./cheeses.route')(app);
//serveren der startes
app.listen(process.env.PORT || 3000, function () {
	console.log('app is running on port', process.env.PORT || 3000);
});
// ────────────────────────────────────────────────────────────────────────────────

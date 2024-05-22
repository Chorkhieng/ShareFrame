const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/place_routes');

const app = express();

app.use('/api/places', placesRoutes);


app.listen(3000);
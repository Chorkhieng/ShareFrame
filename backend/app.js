const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/place_routes');
const HTTPError = require('./models/htttp_error');

const app = express();

app.use(bodyParser.json())

app.use('/api/places', placesRoutes);

app.use((req, res, next) => {
    const err = new HTTPError("Could not find this route.", 404);
    throw err;
});

//middleware
app.use((err, req, res, next) => {
    if (res.headerSent) {
        return next(err);
    }
    res.status(err.code || 500); 
    res.json({message: err.message || 'Unkown error!'});
});


app.listen(3000);
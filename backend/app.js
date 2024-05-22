const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/place_routes');

const app = express();

app.use(bodyParser.json())

app.use('/api/places', placesRoutes);

//middleware
app.use((err, req, res, next) => {
    if (res.headerSent) {
        return next(err);
    }
    res.status(err.code || 500); 
    res.json({message: err.message || 'Unkown error!'});
});


app.listen(3000);
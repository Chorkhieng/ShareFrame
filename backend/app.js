const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/place_routes');
const userRoutes = require('./routes/user_routes');
const HTTPError = require('./models/htttp_error');
const env = require("dotenv");

env.config();

const app = express();

app.use(bodyParser.json())

app.use('/api/places', placesRoutes); // this will start with /api/places ......
app.use('/api/users', userRoutes); // this will start with /api/users .....

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



// connect to database
mongoose.connect(process.env.MONGOOSE_SECRET)
.then(() => {
  console.log('Connected to MongoDB Atlas');
  app.listen(3000);
})
.catch(err => {
  console.error('Error connecting to MongoDB Atlas:', err);
});



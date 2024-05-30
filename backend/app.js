const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/post_routes');
const userRoutes = require('./routes/user_routes');
const HTTPError = require('./models/htttp_error');
const env = require("dotenv");
const fs = require('fs');
const path = require('path');

env.config();

const app = express();

app.use(bodyParser.json());

// middleware for image upload
app.use('/upload/images', express.static(path.join('upload', 'images')));

// add middleware for fetch api in frontend
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

app.use('/api/posts', placesRoutes); // this will start with /api/places ......
app.use('/api/users', userRoutes); // this will start with /api/users .....

app.use((req, res, next) => {
    const err = new HTTPError("Could not find this route.", 404);
    throw err;
});

//middleware
app.use((err, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, err => {
      console.log(err);
    });
  }

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
  app.listen(4000);
})
.catch(err => {
  console.error('Error connecting to MongoDB Atlas:', err);
});



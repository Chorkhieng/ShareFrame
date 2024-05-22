const express = require('express');
// const bodyParser = require('body-parser');
// const HTTPError = require('../models/htttp_error');
const placesControllers = require('../controllers/places_controllers');



const router = express.Router();


// get place by id
router.get('/:placeId', placesControllers.getPlaceById);

// get user by id
router.get('/user/:userId', placesControllers.getUserById);

// /api/places
router.post('/', placesControllers.createPlace);


// export 
module.exports = router;
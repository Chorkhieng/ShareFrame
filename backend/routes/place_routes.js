const express = require('express');
const placesControllers = require('../controllers/places_controllers');
const { check } = require('express-validator');


const router = express.Router();


// get place by id
router.get('/:placeId', placesControllers.getPlaceById);

// get user by id
router.get('/user/:userId', placesControllers.getPlacesUserId);

// /api/places
router.post('/',
                [
                check('title').not().isEmpty(),
                check('description').isLength({min: 5}), // min length is 5 character-long
                check('address').not().isEmpty()
            ],
            placesControllers.createPlace);

router.patch('/:placeId',
            [
                check('title').not().isEmpty(),
                check('description').not().isEmpty(),
                check('address').not().isLength({min: 5}) // min length is 5
            ],
            placesControllers.updatePlaceById);

router.delete('/:placeId', placesControllers.deletePlaceById);


// export 
module.exports = router;
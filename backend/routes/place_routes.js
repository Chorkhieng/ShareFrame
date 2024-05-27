const express = require('express');
const placesControllers = require('../controllers/places_controllers');
const { check } = require('express-validator');
const fileUpload = require('../middleware/file_uplaod');
const checkAuth = require('../middleware/check_auth');

const router = express.Router();


// get place by id
router.get('/:placeId', placesControllers.getPlaceById);

// get user by id
router.get('/user/:userId', placesControllers.getPlacesUserId);

//middleware for web token
router.use(checkAuth);

// /api/places
router.post('/',
            fileUpload.single('image'),
            [
            check('title').not().isEmpty(),
            check('description').isLength({min: 5}), // min length is 5 character-long
            check('address').not().isEmpty()
            ],
            placesControllers.createPlace);

router.patch('/:placeId',
            [
                check('title').not().isEmpty(),
                check('description').isLength({min: 5}), // min length is 
                check('address').not().isEmpty()
            ],
            placesControllers.updatePlaceById);

router.delete('/:placeId', placesControllers.deletePlaceById);


// export 
module.exports = router;
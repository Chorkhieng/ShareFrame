const HTTPError = require('../models/htttp_error');
const uuid = require('uuid/v4'); // third-party library for generating id
const { validationResult } = require('express-validator');
const Place = require('../models/place');

// dummy data
let DUMMY_PLACES = [
    {
        id: "p1",
        title: "Angkor Watt", 
        description: "One of the most complex ancient structures in the world.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/20171126_Angkor_Wat_4712_DxO.jpg/1024px-20171126_Angkor_Wat_4712_DxO.jpg",
        address: "Krong Siem Reap, Cambodia",
        location: {
            lat: 13.412474505050575, 
            lng: 103.866808669721
        },
        creator: 'u1'
    },
    {
        id: "p2",
        title: "Machu Picchu",
        description: "An ancient Inca city located in the Andes mountains of Peru.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Machu_Picchu%2C_Peru.jpg/1024px-Machu_Picchu%2C_Peru.jpg",
        address: "Peru",
        location: {
            lat: -13.1631,
            lng: -72.5450
        },
        creator: 'u1'
    },
    {
        id: "p3",
        title: "Taj Mahal",
        description: "A white marble mausoleum in India, built by Mughal Emperor Shah Jahan in memory of his wife.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/1024px-Taj_Mahal_%28Edited%29.jpeg",
        address: "Dharmapuri, Forest Colony, Tajganj, Agra, Uttar Pradesh 282001, India",
        location: {
            lat: 27.1751,
            lng: 78.0421
        },
        creator: 'u1'
    }
];



const getPlaceById = (req, res, next) => {
    const placeId = req.params.placeId;
    const place = DUMMY_PLACES.find(p => {
        return p.id === placeId;
    });

    if (!place) {
        const err = new HTTPError("Counld not find the given placeId.", 404); // from HTTPError class
        return next(err); // send to the next middleware
    }

    res.json({place});
};


const getPlacesUserId = (req, res, next) => {
    const userId = req.params.userId;
    const userPlaces = DUMMY_PLACES.filter(u => {
        return u.creator === userId;
    });

    if (!userPlaces) {
        const err = new HTTPError("Counld not find the given userId.", 404); // from HTTPError class
        return next(err); // send to the next middleware
    }

    res.json({userPlaces});
};

// post request
const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HTTPError('Invalid inputs passed, please check your data.', 422)
      );
    }
  
    const { title:title, description:description, address:address, creator:creator } = req.body;
    let coordinates;
    try {
        coordinates = req.body.location;
    } catch (error) {
        return next(error);
    }
    const createdPlace = new Place({
      title,
      description,
      address,
      location: coordinates,
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_State_Building_%28aerial_view%29.jpg',
      creator
    });
  
    try {
      await createdPlace.save();
    } catch (err) {
      const error = new HTTPError(
        'Creating place failed, please try again.',
        500
      );
      return next(error);
    }
    
    res.status(201).json({ place: createdPlace });
  };


const updatePlaceById = (req, res, next) => {

    const err = validationResult(req); // check if request has valid data
    if (!err.isEmpty()) {
        throw new HTTPError("Invalid inputs data.", 422);
    }

    const { title, description } = req.body;
    const placeId = req.params.placeId;

    const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId)}; // spread operator
    const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);

    // update title and description
    updatedPlace.title = title;
    updatedPlace.description = description;

    DUMMY_PLACES[placeIndex] = updatedPlace;

    res.status(200).json({place: DUMMY_PLACES[placeIndex]});
};


const deletePlaceById = (req, res, next) => {
    const placeId = req.params.placeId;

    if (DUMMY_PLACES.find(p => p.id === placeId)) {
        throw new HTTPError("Could not find place this id.", 404);
    }
    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);

    res.status(200).json({message: "Place deleted"});
};

exports.getPlaceById = getPlaceById;
exports.getPlacesUserId = getPlacesUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
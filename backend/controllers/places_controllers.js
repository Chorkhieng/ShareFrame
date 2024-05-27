const HTTPError = require('../models/htttp_error');
const { validationResult } = require('express-validator');
const Place = require('../models/place');
const User = require('../models/user');
const mongoose = require('mongoose');
const fs = require('fs');


const getPlaceById = async (req, res, next) => {
    const placeId = req.params.placeId; // { pid: 'p1' }
  
    let place;
    try {
      place = await Place.findById(placeId);
    } catch (err) {
      const error = new HTTPError(
        'Something went wrong, could not find a place.',
        500
      );
      return next(error);
    }
  
    if (!place) {
      const error = new HTTPError(
        'Could not find a place for the provided id.',
        404
      );
      return next(error);
    }
  
    res.json({ place: place.toObject({ getters: true }) }); // => { place } => { place: place }
  };


const getPlacesUserId = async (req, res, next) => {
    const userId = req.params.userId;
    
    let placesWithUser;

    try {
      placesWithUser = await User.findById(userId).populate('places');
    }
    catch (err) {
        const error = new HTTPError("Could not fetch place(s) with given userId.", 500);
        return next(error);
    }

    if (!placesWithUser || (placesWithUser.places.length === 0)) {
        const error = new HTTPError("Counld not find the given userId.", 404); // from HTTPError class
        return next(error); // send to the next middleware
    }

    res.json({places: placesWithUser.places.map(p => p.toObject({getters: true}))});
};

// post request
const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HTTPError('Invalid inputs passed, please check your data.', 422)
      );
    }
  
    const { title: title, description:description, address:address, creator:creator } = req.body;
  
    // const coordinates = req.body.location;
   
  
    // const title = req.body.title;
    const createdPlace = new Place({
      title: title,
      description: description,
      address: address,
      // location: coordinates,
      image: req.file.path,
      creator: creator
    });

    let user;

    try {
      user = await User.findById(creator);
    }
    catch (err) {
      const error = new HTTPError("Failed to create a new place.", 500);
      return next(error);
    }

    if (!user) {
      const error = new HTTPError("Could not find user with the given id.", 404);
      return next(error);
    }
  
    try {
      // await createdPlace.save();

      // this will allow data operations undo if one failed
      // because User has relationship with Place Schema
      const session = await mongoose.startSession();
      session.startTransaction();

      await createdPlace.save({session: session});
      user.places.push(createdPlace);

      await user.save({session: session});
      await session.commitTransaction();
    } catch (err) {
      const error = new HTTPError(
        'Creating place failed, please try again.',
        500
      );
      return next(error);
    }
  
    res.status(201).json({ place: createdPlace });
  };


  const updatePlaceById = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HTTPError("Invalid inputs data.", 422));
    }

    const { title, description, address } = req.body;
    const placeId = req.params.placeId;

    try {
        let updatedPlace = await Place.findById(placeId);
        if (!updatedPlace) {
            throw new HTTPError("Place not found.", 500);
        }

        if (updatedPlace.creator.toString() !== req.userData.userId) {
          const error = new HTTPError("You are not authorized to edit this place.", 401);
          return next(error);
        }

        updatedPlace.title = title.value;
        updatedPlace.description = description.value;
        updatedPlace.address = address.value;

        // Save the updated place
        updatedPlace = await updatedPlace.save();

        res.status(200).json({ place: updatedPlace.toObject({ getters: true }) });
    } catch (error) {
        next(error);
    }
};



const deletePlaceById = async (req, res, next) => {
    const placeId = req.params.placeId;

    let place;

    try {
        place = await Place.findById(placeId).populate('creator'); // key relationship of place and user schemas
    }
    catch (err) {
        const error = new HTTPError("Could not fetch the given placeId.", 500);
        return next(error);
    }

    if (!place) {
      const error = new HTTPError("Could not find place for this id.", 404);
      return next(error);
    }

    // image path is a string in database
    const imagePath = place.image;

    // deleting place
    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        await place.deleteOne({session: session});
        place.creator.places.pull(place);

        await place.creator.save({session: session});
        await session.commitTransaction();
    }
    catch (err) {
        const error = new HTTPError("Could not delete the given placeId.", 404);
        return next(error);
    }

    fs.unlink(imagePath, err => {
      console.log(err);
    })

    res.status(200).json({message: "Place deleted"});
};

exports.getPlaceById = getPlaceById;
exports.getPlacesUserId = getPlacesUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
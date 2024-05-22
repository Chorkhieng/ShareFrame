const HTTPError = require('../models/htttp_error');
const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');
const User = require('../models/user');

// dummy data
const DUMMY_USERS = [
    {
        id: "u1",
        name: "Chork Hieng",
        email: "chork@test.com",
        password: "test123"
    }
]

const getUsers = async (req, res, next) => {
    let users;

    try {
        users = await User.find({}, "-password");
    }
    catch (err) {
        const error = new HTTPError("Fetch failed!", 500);
        return next(error);
    }

    res.json({users: users.map(user => user.toObject({getters: true}))});
};

const signup = async (req, res, next) => {
    const err = validationResult(req); // check if request has valid data
    if (!err.isEmpty()) {
        return next(new HTTPError("Invalid inputs data.", 422));
    }

    
    const {name: name, email: email, password: password} = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({email: email});
    }
    catch (err) {
        const error = new HTTPError("Cound not sign up.", 500);
        return next(error);
    }

    if (existingUser) {
        const error = new HTTPError("User with this email already exist.", 404);
        return next(error);
    }
    

    const createdUser = User ({
        name: name,
        email: email,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Pug_-_1_year_Old_%28cropped%29.jpg/1024px-Pug_-_1_year_Old_%28cropped%29.jpg",
        password: password,
        places: []
    });
    
    try {
        await createdUser.save();
    }
    catch (err) {
        const error = new HTTPError("Cound not sign up. Please try again later.", 500);
        return next(error);
    }

    res.status(201).json({users: createdUser.toObject({getters: true})});
};

const login = async (req, res, next) => {
    const {email, password} = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({email: email});
    }
    catch (err) {
        const error = new HTTPError("The given email does not exist.", 500);
        return next(error);
    }

    if (!existingUser || (existingUser.password !== password)) {
        return next( new HTTPError("Invalid email or password.", 401));
    }

    res.status(200).json({message: "Logged in successfully!"});
};


exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
const HTTPError = require('../models/htttp_error');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('dotenv')


env.config({path: '../.env'});


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
    

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12); // (password, salt)
    }
    catch (err) {
        const error = new HTTPError("Could not create user.", 500);
        return next(error);
    }
   

    const createdUser = User ({
        name: name,
        email: email,
        image: 'http://localhost:4000/' + req.file.path,
        password: hashedPassword,
        places: []
    });
    
    try {
        await createdUser.save();
    }
    catch (err) {
        const error = new HTTPError("Cound not sign up. Please try again later.", 500);
        return next(error);
    }

    // json web token
    let token;
    try {
        token = jwt.sign({
            userId: createdUser.id, 
            email: createdUser.email}, 
            process.env.SECRET_WEB_TOKEN,
            {expiresIn: '1h'} //expire time limit for web token
        ); 
    }
    catch (err) {
        const error = new HTTPError("Sigup failed.", 500);
        return next(error);
    }
    

    res.status(201).json({
        user: createdUser.id,
        email: createdUser.email,
        token: token
        });
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

    if (!existingUser) {
        return next( new HTTPError("Invalid email or password.", 401));
    }

    let isValidPassword = false;

    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    }
    catch (err) {
        const error = new HTTPError("Could not sign in.", 500);
        return next(error);
    }

    if (!isValidPassword) {
        const error = new HTTPError("Invalid credentials for login.", 401);
        return next(error);
    }

    // json web token
    let token;
    try {
        token = jwt.sign({
            userId: existingUser.id, 
            email: existingUser.email}, 
            process.env.SECRET_WEB_TOKEN,
            {expiresIn: '1h'} //expire time limit for web token
        ); 
    }
    catch (err) {
        const error = new HTTPError("Login failed.", 500);
        return next(error);
    }

    res.status(200).json({
        userId: existingUser.id,
        email: existingUser.email,
        token: token
    });
};


exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
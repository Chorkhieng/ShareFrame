const HTTPError = require('../models/htttp_error');
const uuid = require('uuid/v4');

// dummy data
const DUMMY_USERS = [
    {
        id: "u1",
        name: "Chork Hieng",
        email: "chork@test.com",
        password: "test123"
    }
]

const getUsers = (req, res, next) => {
    res.json({users: DUMMY_USERS});
};

const signup = (req, res, next) => {
    const {name, email, password} = req.body;

    const hasUser = DUMMY_USERS.find(u => u.email === email);
    if(hasUser) {
        throw new HTTPError("User with this email already exists. Try another email.");
    }

    const createdUser = {
        id: uuid(),
        name: name,
        email: email,
        password: password
    }
    
    DUMMY_USERS.push(createdUser);

    res.status(201).json({users: createdUser});
};

const login = (req, res, next) => {
    const {email, password} = req.body;

    const identifiedUser = DUMMY_USERS.find(p => p.email === email);

    if (!identifiedUser || (identifiedUser.password !== password)) {
        throw new HTTPError("Invalid email or password!", 401); //auth failed
    }
    res.status(200).json({message: "Logged in successfully!"});
};


exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
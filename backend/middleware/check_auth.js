const HTTPError = require("../models/htttp_error");
const jwt = require('jsonwebtoken');

const env = require('dotenv')

env.config({path: '../.env'});

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Authorization: "Bearer TOKEN"
        if (!token) {
            throw new HTTPError("Authentication failed.");
        }

        const decodedToken = jwt.verify(token, process.env.SECRET_WEB_TOKEN); // {userId, email}
        req.userData = {userId: decodedToken.userId};
        next();
    }
    catch (err) {

        const error = new HTTPError("Authentication failed.", 401);
        return next(error);
    }

};
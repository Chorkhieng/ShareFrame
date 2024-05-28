const HTTPError = require("../models/htttp_error");
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // to handle with browser behavior (OPTIONS show on nework tab)
    if (req.method === "OPTIONS") {
        return next();
    }

    try {
        const token = req.headers.authorization.split(' ')[1]; // Authorization: "Bearer TOKEN"
        if (!token) {
            throw new Error("Authentication failed.");
        }

        const decodedToken = jwt.verify(token, "secret-session"); // {userId, email}
        req.userData = {userId: decodedToken.userId};
        next();
    }
    catch (err) {

        const error = new HTTPError("Authentication failed.", 401);
        return next(error);
    }

};
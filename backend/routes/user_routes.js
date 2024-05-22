const express = require('express');
const userControllers = require('../controllers/users_controllers');
const { check, checkExact } = require('express-validator');


const router = express.Router();


router.get('/', userControllers.getUsers);

router.post('/signup', 
            [
                check('name').not().isEmpty(),
                check('email').normalizeEmail().isEmail(), // convert to all lowercase and is valid email?
                check('password').isLength({min: 8}) // required at least 8 character-long
            ],
            userControllers.signup);

router.post('/login', userControllers.login);


// export 
module.exports = router;
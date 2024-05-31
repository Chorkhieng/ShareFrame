const express = require('express');
const postsControllers = require('../controllers/posts_controllers');
const { check } = require('express-validator');
const fileUpload = require('../middleware/file_uplaod');
const checkAuth = require('../middleware/check_auth');
const commentsControllers = require('../controllers/comments_controllers');

const router = express.Router();

// FOR TESTING ONLY
// router.post('/post/:postId/comments', commentsControllers.createComment);
// router.get('/post/:postId/comments', commentsControllers.getCommentsByPostId);

// page demo
router.get('/demo');

// new feeds
router.get('/all', postsControllers.getAllPosts);

// get place by id
router.get('/:postId', postsControllers.getPostById);

// get user by id
router.get('/user/:userId', postsControllers.getPostsByUserId);

// Comment routes
router.post('/post/:postId/comments', commentsControllers.createComment);
router.get('/post/:postId/comments', commentsControllers.getCommentsByPostId);

//middleware for web token
router.use(checkAuth);

// /api/places
router.post('/',
            fileUpload.single('image'),
            [
                check('title').not().isEmpty(),
                check('description').isLength({min: 5}), // min length is 5 character-long
                check('authorImage').not().isEmpty(),
                check('authorName').not().isEmpty()
            ],
            postsControllers.createPost);

router.patch('/:postId',
            [
                check('title').not().isEmpty(),
                check('description').isLength({min: 5}) // min length is 
            ],
            postsControllers.updatePostById);

// Like/unlike a post by ID
router.patch('/:postId/like', postsControllers.likePost);

router.delete('/:postId', postsControllers.deletePostById);


// export 
module.exports = router;
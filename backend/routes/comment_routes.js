const express = require('express');
const { check } = require('express-validator');
const checkAuth = require('../middleware/check_auth');
const commentsControllers = require('../controllers/comments_controllers');
const router = express.Router();

// Comment routes
router.get('/:postId/comments', commentsControllers.getCommentsByPostId);


//middleware for web token
router.use(checkAuth);

// Create a new comment
router.post(
    '/:postId/comments',
    [
      check('content').not().isEmpty(),
    ],
    commentsControllers.createComment
);

// Update a comment by comment ID
// router.patch(
//     '/post/:postId/comments/:commentId',
//     [
//       check('content').not().isEmpty(),
//     ],
//     commentsControllers.updateComment
// );

// Route for creating a reply to a comment
router.post(
    '/reply/:postId/comments',
    [
      check('content').not().isEmpty(),
      check('userId').not().isEmpty(),
      check('postId').not().isEmpty(),
      check('parentCommentId').not().isEmpty() // Assuming parentCommentId is sent in the request body
    ],
    commentsControllers.createReply
);




// export 
module.exports = router;
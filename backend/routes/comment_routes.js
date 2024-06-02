const express = require('express');
const { check } = require('express-validator');
const checkAuth = require('../middleware/check_auth');
const commentsControllers = require('../controllers/comments_controllers');
const router = express.Router();


// FOR TESTING ONLY
// router.delete(
//   '/:commentId/comments',
//   commentsControllers.deleteCommentById
// );

router.delete(
  '/post/:postId/comments',
  commentsControllers.deleteCommentByPostId
);

// Comment routes
router.get('/:postId/comments', commentsControllers.getCommentsByPostId);

//middleware for web token
router.use(checkAuth);

// Create a new comment
router.post(
    '/:postId/comments',
    [
      check('content').not().isEmpty(),
      check('userId').not().isEmpty()
    ],
    commentsControllers.createComment
);

// Update a comment by comment ID
router.patch(
    '/update/:postId/comment/:commentId',
    [
      check('content').not().isEmpty()
    ],
    commentsControllers.updateComment
);

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

// delete comment by commentId
router.delete(
  '/:commentId/comments',
  commentsControllers.deleteCommentById
);

// delete all comments with a postId
// router.delete(
//   '/post/:postId/comments',
//   commentsControllers.deleteCommentByPostId
// );




// export 
module.exports = router;
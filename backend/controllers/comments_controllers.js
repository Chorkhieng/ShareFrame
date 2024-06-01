const Comment = require('../models/comment');
const { validationResult } = require('express-validator');
const HTTPError = require('../models/htttp_error');
const Post = require('../models/post');
const User = require('../models/user');

const createComment = async (req, res, next) => {
  const { content: content, userId: userId, parentCommentId: parentCommentId} = req.body;
  const postId = req.params.postId;

  try {
    const newComment = new Comment({
      content: content,
      userId: userId,
      postId: postId,
      parentCommentId: parentCommentId || null,
      createdAt: new Date(),
      replies: []
    });

    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, { $push: { replies: newComment._id } });
    }

    await newComment.save();

    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ message: 'Creating comment failed, please try again.' });
  }
};

const getCommentsByPostId = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const comments = await Comment.find({ postId, parentComment: null }) // Get top-level comments
      .populate('userId', 'name image') // Populate user details for top-level comments
      .populate({
        path: 'replies',
        populate: {
          path: 'userId',
          select: 'name image'
        }
      })
      .populate({
        path: 'replies',
        populate: {
          path: 'replies',
          populate: {
            path: 'userId',
            select: 'name image'
          }
        }
      });

    res.json({comments : comments.map(c => c.toObject({getters: true}))});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Fetching comments failed, please try again.' });
  }
};

// Update a comment by comment ID
const updateComment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HTTPError('Invalid inputs, please check your data.', 422));
  }

  const { 
    content: content
   } = req.body;
  const commentId = req.params.commentId;

  let comment;
  try {
    comment = await Comment.findById(commentId);
  } catch (err) {
    const error = new HTTPError(
      'Something went wrong, could not update comment.',
      500
    );
    return next(error);
  }

  if (!comment) {
    const error = new HTTPError('Could not find comment for the provided id.', 404);
    return next(error);
  }

  comment.content = content;

  try {
    await comment.save();
  } catch (err) {
    const error = new HTTPError(
      'Something went wrong, could not update comment.',
      500
    );
    return next(error);
  }

  res.status(200).json({ comment: comment.toObject({ getters: true }) });
};


const createReply = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HTTPError('Invalid inputs provided, please check your data.', 422));
  }

  const { 
    content, 
    userId, 
    postId,
    parentCommentId 
  } = req.body;

  const newComment = new Comment({
    content: content,
    userId: userId,
    postId: postId,
    parentCommentId: parentCommentId, 
    createdAt: new Date(),
    replies: []
  });

  try {
    await newComment.save();
    // Assuming the parent comment exists and has the replies array field
    await Comment.findByIdAndUpdate(parentCommentId, { $push: { replies: newComment._id } });
  } catch (err) {
    const error = new HTTPError('Creating reply failed, please try again.', 500);
    return next(error);
  }

  res.status(201).json({ comment: newComment.toObject({ getters: true }) });
};

// DELETE /comments/:id
const deleteCommentById = async (req, res) => {
  const commentId = req.params.commentId;

  try {
    // Find the comment by ID
    const comment = await Comment.findById(commentId);

    // Check if the comment exists
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Find the parent comment, if any
    const parentComment = await Comment.findOneAndUpdate(
      { replies: commentId },
      { $pull: { replies: commentId } }
    );

    // Remove the comment from its parent's replies array
    if (parentComment) {
      await parentComment.save();
    }

    // Delete all comments that directly reply to this comment
    await Comment.deleteMany({ parentCommentId: commentId });

    // Delete the comment
    await comment.deleteOne();

    // Return success response
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


// DELETE /comments/post/:postId
const deleteCommentByPostId = async (req, res) => {
  const postId = req.params.postId;

  try {
    // Find all comments with the specified postId
    const commentsToDelete = await Comment.find({ postId });

    // Delete all comments with the specified postId
    await Comment.deleteMany({ postId });

    // Return success response
    res.json({ message: 'Comments deleted successfully', count: commentsToDelete.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};



exports.createComment = createComment;
exports.getCommentsByPostId = getCommentsByPostId;
exports.updateComment = updateComment;
exports.createReply = createReply;
exports.deleteCommentById = deleteCommentById;
exports.deleteCommentByPostId = deleteCommentByPostId;
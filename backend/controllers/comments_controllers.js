const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');

exports.createComment = async (req, res, next) => {
  const { content, userId, parentCommentId } = req.body;
  const postId = req.params.postId;

  try {
    const newComment = new Comment({
      content,
      user: userId,
      post: postId,
      parentComment: parentCommentId || null,
      createdAt: new Date(),
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

exports.getCommentsByPostId = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const comments = await Comment.find({ post: postId }).populate('user').populate('replies');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Fetching comments failed, please try again.' });
  }
};

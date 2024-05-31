const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');

const createComment = async (req, res, next) => {
  const { content, userId, parentCommentId } = req.body;
  const postId = req.params.postId;

  try {
    const newComment = new Comment({
      content,
      userId: userId,
      postId: postId,
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

    res.json({comments : comments.map(p => p.toObject({getters: true}))});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Fetching comments failed, please try again.' });
  }
};



exports.createComment = createComment;
exports.getCommentsByPostId = getCommentsByPostId;
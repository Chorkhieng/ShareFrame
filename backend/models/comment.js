const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    content: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    postId: { type: mongoose.Types.ObjectId, required: true, ref: 'Post' },
    parentCommentId: { type: mongoose.Types.ObjectId, ref: 'Comment' }, // Reference to the parent comment
    createdAt: { type: Date, default: Date.now },
    replies: [{ type: Schema.Types.ObjectId, ref: 'Comment' }] // Array of comment IDs for replies to this comment
});

module.exports = mongoose.model('Comment', commentSchema);

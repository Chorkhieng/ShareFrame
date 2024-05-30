const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const likeSchema = new Schema({
    postId: {type: mongoose.Types.ObjectId, required: true, ref: 'Post'},
    likerId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    posterId: {type: mongoose.Types.ObjectId, required: true, ref: 'User'},
    likes: {type: Boolean, required: true}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Like', likeSchema);
const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const postSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    authorImage: { type: String, required: true },
    authorName: { type: String, required: true },
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    createdAt: {type: Date, default: Date.now},
    likes: [{type: mongoose.Types.ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('Post', postSchema);
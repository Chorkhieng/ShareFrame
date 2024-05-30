const HTTPError = require('../models/htttp_error');
const { validationResult } = require('express-validator');
const Post = require('../models/post');
const User = require('../models/user');
const mongoose = require('mongoose');
const fs = require('fs');


const getPostById = async (req, res, next) => {
    const postId = req.params.postId;
  
    let post;
    try {
      post = await Post.findById(postId);
    } catch (err) {
      const error = new HTTPError(
        'Something went wrong, could not find a post.',
        500
      );
      return next(error);
    }
  
    if (!post) {
      const error = new HTTPError(
        'Could not find a post for the provided id.',
        404
      );
      return next(error);
    }
  
    res.json({ post: post.toObject({ getters: true }) }); // => { place } => { place: place }
  };


const getPostsByUserId = async (req, res, next) => {
    const userId = req.params.userId;
    
    let postWithUser;

    try {
      postWithUser = await User.findById(userId).populate('posts');
    }
    catch (err) {
        const error = new HTTPError("Could not fetch post(s) with given userId.", 500);
        return next(error);
    }

    if (!postWithUser /* || (placesWithUser.places.length === 0) */) {
        return next(new HTTPError("Counld not find posts with the given userId.", 404)); // from HTTPError class
    }

    res.json({posts: postWithUser.posts.map(p => p.toObject({getters: true}))});
};

// post request
const createPost = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HTTPError('Invalid inputs passed, please check your data.', 422)
      );
    }
  
    const { 
      title: title, 
      description: description, 
      authorImage: authorImage, 
      authorName: authorName,
      userId: userId
    } = req.body;
  
    // const coordinates = req.body.location;
    // console.log(req.body);
   
  
    // const title = req.body.title;
    const createdPost = new Post({
      title: title,
      description: description,
      image: req.file.path,
      authorImage: authorImage,
      authorName: authorName,
      creator: userId
    });

    let user;

    try {
      user = await User.findById(req.userData.userId);
    }
    catch (err) {
      const error = new HTTPError("Failed to create a new post.", 500);
      return next(error);
    }

    if (!user) {
      const error = new HTTPError("Could not find user with the given id.", 404);
      return next(error);
    }
  
    try {
      // await createdPlace.save();

      // this will allow data operations undo if one failed
      // because User has relationship with Place Schema
      const session = await mongoose.startSession();
      session.startTransaction();

      await createdPost.save({session: session});
      user.posts.push(createdPost);

      await user.save({session: session});
      await session.commitTransaction();
    } catch (err) {
      const error = new HTTPError(
        'Creating post failed, please try again.',
        500
      );
      return next(error);
    }
  
    res.status(201).json({ post: createdPost });
  };


  const updatePostById = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HTTPError("Invalid inputs data.", 422));
    }

    const { title, description} = req.body;
    const postId = req.params.postId;

    try {
        let updatedPost = await Post.findById(postId);
        if (!updatedPost) {
            throw new HTTPError("Place not found.", 500);
        }

        if (updatedPost.creator.toString() !== req.userData.userId) {
          const error = new HTTPError("You are not authorized to edit this post.", 401);
          return next(error);
        }

        updatedPost.title = title.value;
        updatedPost.description = description.value;

        // Save the updated place
        updatedPost = await updatedPost.save();

        res.status(200).json({ post: updatedPost.toObject({ getters: true }) });
    } catch (error) {
        next(error);
    }
};



const deletePostById = async (req, res, next) => {
    const postId = req.params.postId;

    let post;

    try {
        post = await Post.findById(postId).populate('creator'); // key relationship of place and user schemas
    }
    catch (err) {
        const error = new HTTPError("Could not fetch the given postId.", 500);
        return next(error);
    }

    if (!post) {
      const error = new HTTPError("Could not find post for this id.", 404);
      return next(error);
    }

    if (post.creator.id.toString() !== req.userData.userId) {
      const error = new HTTPError("You are not authorized to delete this post.", 401);
      return next(error);
    }

    // image path is a string in database
    const imagePath = post.image;

    // deleting place
    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        await post.deleteOne({session: session});
        post.creator.posts.pull(post);

        await post.creator.save({session: session});
        await session.commitTransaction();
    }
    catch (err) {
        const error = new HTTPError("Could not delete the given postId.", 404);
        return next(error);
    }

    fs.unlink(imagePath, err => {
      console.log(err);
    })

    res.status(200).json({message: "Post deleted"});
};


// get all posts for new feeds
const getAllPosts = async (req, res, next) => {
  let allPosts;

  try {
    allPosts = await Post.find();
  } catch (err) {
    const error = new HTTPError("Could not fetch posts.", 500);
    return next(error);
  }

  if (!allPosts /* || allPosts.length === 0 */) {
    return next(new HTTPError("Could not find any posts.", 404));
  }

  res.json({ posts: allPosts.map(post => post.toObject({ getters: true })) });
};


exports.getPostById = getPostById;
exports.getPostsByUserId = getPostsByUserId;
exports.createPost = createPost;
exports.updatePostById = updatePostById;
exports.deletePostById = deletePostById;
exports.getAllPosts = getAllPosts;
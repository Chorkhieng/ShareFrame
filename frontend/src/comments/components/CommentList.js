import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewComment from '../pages/NewComment';
import Comment from './Comments';

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/api/posts/${postId}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [postId]);

  const handleCommentAdded = (newComment) => {
    setComments((prevComments) => [...prevComments, newComment]);
  };

  return (
    <div>
      <h2>Comments</h2>
      <NewComment postId={postId} onCommentAdded={handleCommentAdded} />
      {comments.map(comment => (
        <Comment key={comment._id} comment={comment} postId={postId} onCommentAdded={handleCommentAdded} />
      ))}
    </div>
  );
};

export default CommentList;

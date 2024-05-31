import React, { useState } from 'react';
import axios from 'axios';

const ReplyComment = ({ postId, parentCommentId, onCommentAdded }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/posts/${postId}/comments`, {
        content,
        userId: 'currentUserId', // Replace with the actual logged-in user ID
        parentCommentId,
      });
      setContent('');
      onCommentAdded(response.data);
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a reply..."
        required
      ></textarea>
      <button type="submit">Submit</button>
    </form>
  );
};

export default ReplyComment;

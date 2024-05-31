import React, { useState } from 'react';
import axios from 'axios';

const ReplyComment = ({ postId, parentCommentId, onCommentAdded }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/posts/post/${postId}/comments`, { content, parentComment: parentCommentId });
      setContent('');
      onCommentAdded();
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Reply to this comment"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default ReplyComment;

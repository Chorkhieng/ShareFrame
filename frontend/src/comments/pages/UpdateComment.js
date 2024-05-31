import React, { useState } from 'react';
import axios from 'axios';

const UpdateComment = ({ postId, commentId, existingContent, onCommentUpdated }) => {
  const [content, setContent] = useState(existingContent);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`/api/posts/post/${postId}/comments/${commentId}`, { content });
      onCommentUpdated();
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit">Update</button>
    </form>
  );
};

export default UpdateComment;

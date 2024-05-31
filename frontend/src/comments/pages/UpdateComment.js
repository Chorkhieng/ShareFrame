import React, { useState } from 'react';
import axios from 'axios';

const UpdateComment = ({ postId, commentId, existingContent, onCommentUpdated }) => {
  const [content, setContent] = useState(existingContent);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(`/api/posts/${postId}/comments/${commentId}`, {
        content,
      });
      onCommentUpdated(response.data);
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  return (
    <form onSubmit={handleUpdate}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      ></textarea>
      <button type="submit">Update</button>
    </form>
  );
};

export default UpdateComment;

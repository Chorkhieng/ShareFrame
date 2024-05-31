import React, { useState } from 'react';
import { useHTTPClient } from '../../shared/hooks/http-hook';

const UpdateComment = ({ postId, commentId, existingContent, onCommentUpdated }) => {
  const [content, setContent] = useState(existingContent);
  const { sendRequest } = useHTTPClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendRequest(
        `/api/posts/comments/${postId}/comments/${commentId}`,
        'PATCH',
        JSON.stringify({ content }),
        { 'Content-Type': 'application/json' }
      );
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

import React, { useState } from 'react';
import { useHTTPClient } from '../../shared/hooks/http-hook';

const ReplyComment = ({ postId, parentCommentId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const { sendRequest } = useHTTPClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const responseData = await sendRequest(
        `/api/posts/post/${postId}/comments`,
        'POST',
        JSON.stringify({ content, parentComment: parentCommentId }),
        { 'Content-Type': 'application/json' }
      );
      setContent('');
      onCommentAdded(responseData.comment); // Assuming responseData contains the newly created comment
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

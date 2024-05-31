import React, { useState } from 'react';
import { useHTTPClient } from '../../shared/hooks/http-hook';

const NewComment = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const { sendRequest } = useHTTPClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const responseData = await sendRequest(
        `/api/posts/post/${postId}/comments`,
        'POST',
        JSON.stringify({ content }),
        { 'Content-Type': 'application/json' }
      );
      setContent('');
      onCommentAdded(responseData.comment); // Assuming responseData contains the newly created comment
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a comment"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default NewComment;

import React, { useState } from 'react';
import axios from 'axios';

const NewComment = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/posts/post/${postId}/comments`, { content });
      setContent('');
      onCommentAdded();
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

import React, { useState } from 'react';
import axios from 'axios';

const NewComment = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/posts/${postId}/comments`, {
        content,
        userId: 'currentUserId', // Replace with the actual logged-in user ID
      });
      setContent('');
      onCommentAdded(response.data);
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a comment..."
        required
      ></textarea>
      <button type="submit">Submit</button>
    </form>
  );
};

export default NewComment;

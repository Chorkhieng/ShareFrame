import React, { useState, useContext } from 'react';
import { useHTTPClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth_context';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const UpdateComment = ({ postId, commentId, existingContent, refreshComments, onCommentUpdated }) => {
  const auth = useContext(AuthContext);
  const [content, setContent] = useState(existingContent);
  const { isLoading, error, clearError, sendRequest } = useHTTPClient();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        content: content
      };

      await sendRequest(
        `http://localhost:4000/api/comments/update/${postId}/comment/${commentId}`,
        'PATCH',
        JSON.stringify(payload),
        { 
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token 
        }
      );

      if (onCommentUpdated) {
        onCommentUpdated();
      }
      
      // Call the refresh function after successful update
      refreshComments();
    } catch (error) {
      // error is already handled in hook
    }
  };

  const handleCancel = () => {
    // Implement any logic you need for canceling the update
    // For example, resetting the content
    setContent(existingContent);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <form className="new-comment-form" onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update'}
        </Button>
        <Button onClick={handleCancel} disabled={isLoading}>
          Cancel
        </Button>
      </form>
    </React.Fragment>
  );
};

export default UpdateComment;

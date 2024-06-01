import React, { useState } from 'react';
import { useHTTPClient } from '../../shared/hooks/http-hook';
import { useContext } from 'react';
import { AuthContext } from '../../shared/context/auth_context';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';

const UpdateComment = ({ postId, commentId, existingContent, onCommentUpdated }) => {
  const auth = useContext(AuthContext);
  const [content, setContent] = useState(existingContent);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { sendRequest } = useHTTPClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

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
      onCommentUpdated();
    } catch (error) {
      setError(error.message || 'Something went wrong, please try again.');
    }
    setIsLoading(false);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={() => setError(null)} />
      <form className="new-comment-form" onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button type="submit" disabled={isLoading} onClick={() => window.location.reload()}>
          {isLoading ? 'Updating...' : 'Update'}
        </Button>
      </form>
    </React.Fragment>
  );
};

export default UpdateComment;

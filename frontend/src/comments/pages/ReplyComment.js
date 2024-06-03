import React, { useState, useContext } from 'react';
import { useHTTPClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth_context';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const ReplyComment = ({ postId, parentCommentId, onCommentAdded, refreshComments, cancelHandler }) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHTTPClient();

  const [content, setContent] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleContentChange = (event) => {
    const value = event.target.value;
    setContent(value);
    if (value.trim() !== '') {
      setIsValid(true);
      setErrorText('');
    } else {
      setIsValid(false);
      setErrorText('Please write your reply.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isValid) {
      setErrorText('Please write your reply.');
      return;
    }

    try {
      const payload = {
        content: content,
        userId: auth.userId,
        postId: postId,
        parentCommentId: parentCommentId
      };
      
      const responseData = await sendRequest(
        `http://localhost:4000/api/comments/reply/${postId}/comments`,
        'POST',
        JSON.stringify(payload),
        { 
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token 
        }
      );
      if (onCommentAdded) {
        onCommentAdded(responseData.comment);
        refreshComments(); // Refresh comments data
      }
      setContent(''); // Clear the content after successful submission
    } catch (error) {
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <form onSubmit={handleSubmit}>
        <div className={`form-control ${!isValid && 'form-control--invalid'}`}>
          <label htmlFor="content">Reply</label>
          <textarea
            id="content"
            rows="5"
            value={content}
            onChange={handleContentChange}
          />
          {!isValid && <p>{errorText}</p>}
        </div>
        <div>
          <Button type="submit" disabled={!isValid || isLoading}>
            {isLoading ? 'Submitting...' : 'Submit'}
          </Button>
          <Button type="button" onClick={cancelHandler} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </form>
    </React.Fragment>
  );
};

export default ReplyComment;

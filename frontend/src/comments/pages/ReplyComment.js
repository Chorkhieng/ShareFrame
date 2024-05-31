import React, { useState, useContext } from 'react';
import { useHTTPClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth_context';
import Button from '../../shared/components/FormElements/Button';

const ReplyComment = ({ postId, parentCommentId, onCommentAdded }) => {
  const auth = useContext(AuthContext);
  const { sendRequest } = useHTTPClient();

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
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
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
      <Button type="submit" disabled={!isValid}>
        SUBMIT POST
      </Button>
    </form>
  );
};

export default ReplyComment;
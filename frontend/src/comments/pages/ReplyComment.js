import React, { useContext } from 'react';
import { useHTTPClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth_context';
import { useForm } from '../../shared/hooks/form-hook';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { VALIDATOR_REQUIRE } from '../../shared/util/validators';

const ReplyComment = ({ postId, parentCommentId, onCommentAdded }) => {
  const auth = useContext(AuthContext);
  const { sendRequest } = useHTTPClient();

  const [formState, inputHandler] = useForm(
    {
      content: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('content', formState.inputs.content.value);
      formData.append('userId', auth.userId);
      formData.append('postId', postId);
      formData.append('parentCommentId', parentCommentId);
      // formData.append('replies', []);
      const responseData = await sendRequest(
        `http://localhost:4000/api/comments/reply/${postId}/comments`,
        'POST',
        formData,
        { 
          Authorization: 'Bearer ' + auth.token 
        }
      );
      if (onCommentAdded) {
        onCommentAdded(responseData.comment);
      }
    } catch (error) { }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        id="content"
        element="textarea"
        label="Reply"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please write your reply."
        onInput={inputHandler}
      />
      <Button type="submit" disabled={!formState.isValid}>
        SUBMIT POST
      </Button>
    </form>
  );
};

export default ReplyComment;
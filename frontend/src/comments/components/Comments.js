import React, { useState } from 'react';
import ReplyComment from '../pages/ReplyComment';
import UpdateComment from '../pages/UpdateComment';

const Comment = ({ comment, postId, onCommentAdded }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  return (
    <div>
      <img src={comment.user.image} alt="Commenter" />
      <p>{comment.user.name}</p>
      <p>{new Date(comment.createdAt).toLocaleString()}</p>
      <p>{comment.content}</p>
      <button onClick={() => setShowReplyForm(!showReplyForm)}>
        {showReplyForm ? 'Cancel' : 'Reply'}
      </button>
      <button onClick={() => setShowUpdateForm(!showUpdateForm)}>
        {showUpdateForm ? 'Cancel' : 'Update'}
      </button>
      {showReplyForm && (
        <ReplyComment
          postId={postId}
          parentCommentId={comment._id}
          onCommentAdded={onCommentAdded}
        />
      )}
      {showUpdateForm && (
        <UpdateComment
          postId={postId}
          commentId={comment._id}
          existingContent={comment.content}
          onCommentUpdated={onCommentAdded}
        />
      )}
      <div style={{ marginLeft: '20px' }}>
        {comment.replies.map(reply => (
          <Comment key={reply._id} comment={reply} postId={postId} onCommentAdded={onCommentAdded} />
        ))}
      </div>
    </div>
  );
};

export default Comment;

import React, { useState } from 'react';
import ReplyComment from '../pages/ReplyComment';
import UpdateComment from '../pages/UpdateComment';
import Card from '../../shared/components/UIElements/Card';
import Avatar from '../../shared/components/UIElements/Avatar';
import ReadMore from '../../shared/hooks/show-less-more-text-hook';
import Button from '../../shared/components/FormElements/Button';
import { AuthContext } from '../../shared/context/auth_context';
import { useContext } from 'react';
import './CommentStyle.css';

const Comment = ({ comment, postId, onCommentAdded }) => {
    const auth = useContext(AuthContext);
    
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [showContent, setShowContent] = useState(true); // State to control content visibility

    if (!comment || !comment.userId) {
        return null;
    }

    const handleCommentAdded = (newComment) => {
        // Call the function passed from the parent component to update comments
        if (onCommentAdded) {
            onCommentAdded(newComment);
        }
    };

    const toggleReplyForm = () => {
        setShowReplyForm(prevState => !prevState);
        setShowUpdateForm(false); // Close update form if it's open
    };

    const toggleUpdateForm = () => {
        setShowUpdateForm(prevState => !prevState);
        setShowReplyForm(false); // Close reply form if it's open
    };

    const toggleContent = () => {
        setShowContent(prevState => !prevState); // Toggle content visibility
    };

    return (
        <React.Fragment>
            <Card className="comment-card">
                <div className="user-item__content" width="100%" height="40px">
                    <div className="user-item__image commenter-avatar">
                        <Avatar 
                            image={comment.userId.image} 
                            alt={comment.userId.name}
                            style={{ 
                                border: '2px solid purple', 
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px'
                            }}
                        />
                    </div>
                    <div className="comment-details">
                        <h5>{comment.userId.name}</h5>
                        <p>{new Date(comment.createdAt).toLocaleString()}</p>
                    </div>
                    <Button onClick={toggleContent}>
                        {showContent ? 'Hide' : 'Show'}
                    </Button>
                </div>
                <div className="comment-content">
                    {showContent && <ReadMore content={comment.content} maxLength={100} />}
                </div>
                
                <div className="comment-actions">
                    <Button onClick={toggleReplyForm}>
                        {showReplyForm ? 'Cancel' : 'Reply'}
                    </Button>
                    {auth.userId === comment.userId.id && 
                        <Button onClick={toggleUpdateForm}>
                            {showUpdateForm ? 'Cancel' : 'Update'}
                        </Button>}
                </div>
                {showReplyForm && (
                    <ReplyComment
                        postId={postId}
                        parentCommentId={comment._id}
                        onCommentAdded={handleCommentAdded} // Pass the function to handle comment addition
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
                <div className="comment-replies" style={{ display: showContent ? 'block' : 'none' }}>
                    {comment.replies && comment.replies.length > 0 && comment.replies.map(reply => (
                        <Comment key={reply?._id} comment={reply} postId={postId} onCommentAdded={onCommentAdded} showContentProp={showContent} />
                    ))}
                </div>
            </Card>
        </React.Fragment>
    );
};

export default Comment;

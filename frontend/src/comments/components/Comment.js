import React, { useState, useContext } from 'react';
import ReplyComment from '../pages/ReplyComment';
import UpdateComment from '../pages/UpdateComment';
import Card from '../../shared/components/UIElements/Card';
import Avatar from '../../shared/components/UIElements/Avatar';
import ReadMore from '../../shared/hooks/show-less-more-text-hook';
import Button from '../../shared/components/FormElements/Button';
import { AuthContext } from '../../shared/context/auth_context';
import DeleteComment from '../pages/DeleteComment';

const Comment = ({ comment, postId, onCommentAdded, refreshComments, onDelete }) => {
    const auth = useContext(AuthContext);
    
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [showContent, setShowContent] = useState(true); // State to control content visibility

    // Function to calculate the number of days passed since the comment was created
    const getDaysPassed = (createdAt) => {
        const commentDate = new Date(createdAt);
        const currentDate = new Date();
        const differenceInTime = currentDate.getTime() - commentDate.getTime();
        const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

        if (differenceInDays === 1) {
            return "Yesterday";
        }
        if (differenceInDays === 0) {
            return "Today";
        }
        return differenceInDays.toString() + "days ago";
    };

    if (!comment || !comment.userId) {
        return null;
    }

    const handleCommentAdded = (newComment) => {
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
                <Card className="user-item__content" width="fit-content" height="40px">
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
                        <p>{getDaysPassed(comment.createdAt)}</p>
                    </div>
                    <button onClick={toggleContent}>
                        {showContent ? 'Hide' : 'Show'}
                    </button>
                </Card>
                <div className="comment-content">
                    {showContent && <ReadMore content={comment.content} maxLength={100} />}
                </div>
                <div className="comment-actions" style={{ display: showContent ? 'block' : 'none' }}>
                    <Button onClick={toggleReplyForm}>
                        {showReplyForm ? 'Cancel' : 'Reply'}
                    </Button>
                    {auth.userId === comment.userId.id && (
                        <React.Fragment>
                            <Button onClick={toggleUpdateForm}>
                                {showUpdateForm ? 'Cancel' : 'Update'}
                            </Button>
                            <DeleteComment 
                                commentId={comment._id} 
                                onDelete={onDelete} 
                                refreshComments={refreshComments}
                            />
                        </React.Fragment>
                    )}

                </div>
                {showReplyForm && (
                    <ReplyComment
                        postId={postId}
                        parentCommentId={comment._id}
                        onCommentAdded={handleCommentAdded} // Pass the function to handle comment addition
                        refreshComments={refreshComments}
                    />
                )}
                {showUpdateForm && (
                    <UpdateComment
                        postId={postId}
                        commentId={comment._id}
                        existingContent={comment.content}
                        onCommentUpdated={onCommentAdded}
                        refreshComments={refreshComments}
                    />
                )}
                <div className="comment-replies" style={{ display: showContent ? 'block' : 'none' }}>
                    {comment.replies && comment.replies.length > 0 && comment.replies.map(reply => (
                        <Comment key={reply?._id} comment={reply} postId={postId} onCommentAdded={onCommentAdded} refreshComments={refreshComments} onDelete={onDelete} />
                    ))}
                </div>
            </Card>
        </React.Fragment>
    );
};

export default Comment;

import React, { useState, useContext } from 'react';
import ReplyComment from '../pages/ReplyComment';
import UpdateComment from '../pages/UpdateComment';
import Card from '../../shared/components/UIElements/Card';
import Avatar from '../../shared/components/UIElements/Avatar';
import ReadMore from '../../shared/hooks/show-less-more-text-hook';
import { AuthContext } from '../../shared/context/auth_context';
import DeleteComment from '../pages/DeleteComment';
import './CommentStyle.css'

const Comment = ({ comment, postId, onCommentAdded, refreshComments, onDelete }) => {
    const auth = useContext(AuthContext);
    
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showContent, setShowContent] = useState(true);

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
        return `${differenceInDays} days ago`;
    };

    if (!comment || !comment.userId) {
        return null;
    }

    const handleCommentAdded = (newComment) => {
        if (onCommentAdded) {
            onCommentAdded(newComment);
        }
    };

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        setShowReplyForm(option === 'Reply');
        setShowUpdateForm(option === 'Update');
        if (option === 'Show' || option === 'Hide') {
            setShowContent(option === 'Show');
        }
    };

    const cancelDeleteHandler = () => {
        // Set selected option back to null to reset the dropdown
        setSelectedOption(null);
        setSelectedOption(""); // set back unselected mode
    };

    const cancelReplyHandler = () => {
        setShowReplyForm(false); // Hide the reply form when canceled
        setSelectedOption('');
    };

    return (
        <React.Fragment>
            <Card className="comment-card">
                <div className='comment-options'>
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
                        
                    </Card>
                    <select className="select-wrapper" value={selectedOption} onChange={(e) => handleOptionSelect(e.target.value)}>
                            <option value="">●●●</option>
                            <option value="Reply">Reply</option>
                            <option value={showContent ? "Hide" : "Show"}>{showContent ? "Hide" : "Show"}</option>
                            {auth.userId === comment.userId.id && (
                                <React.Fragment>
                                    <option value="Update">Update</option>
                                    <option value="Delete">Delete</option>
                                </React.Fragment>
                            )}
                    </select>
                </div>
                <div className="comment-content">
                    {showContent &&
                    <ReadMore 
                        content={comment.content} 
                        maxLength={100} 
                    />}
                </div>
                <div className="comment-actions">
                    {showReplyForm && (
                        <ReplyComment
                            postId={postId}
                            parentCommentId={comment._id}
                            onCommentAdded={handleCommentAdded} // Pass the function to handle comment addition
                            refreshComments={refreshComments}
                            cancelHandler={cancelReplyHandler} // Pass the cancel handler
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
                    {selectedOption === 'Delete' && (
                        <DeleteComment 
                            commentId={comment._id} 
                            onDelete={onDelete} 
                            refreshComments={refreshComments}
                            cancelHandler={cancelDeleteHandler} // Pass the cancel handler to DeleteComment
                        />
                    )}
                </div>
                <div className="comment-replies">
                    {comment.replies && comment.replies.length > 0 && comment.replies.map(reply => (
                        <Comment 
                            key={reply?._id} 
                            comment={reply} 
                            postId={postId} 
                            onCommentAdded={onCommentAdded} 
                            refreshComments={refreshComments} 
                            onDelete={onDelete} 
                        />
                    ))}
                </div>
            </Card>
        </React.Fragment>
    );
};

export default Comment;

import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useHTTPClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Button from '../../shared/components/FormElements/Button';

import { AuthContext } from '../../shared/context/auth_context';
import ReplyComment from '../pages/ReplyComment';
import UpdateComment from '../pages/UpdateComment';
import Card from '../../shared/components/UIElements/Card';
import Avatar from '../../shared/components/UIElements/Avatar';
import ReadMore from '../../shared/hooks/show-less-more-text-hook';
import './CommentStyle.css';

const CommentList = ({ postId }) => {
    const auth = useContext(AuthContext);
    const [comments, setComments] = useState([]);
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [newCommentContent, setNewCommentContent] = useState('');
    const { isLoading, error, sendRequest, clearError } = useHTTPClient();

    const fetchComments = useCallback(async () => {
        try {
            const responseData = await sendRequest(`http://localhost:4000/api/comments/${postId}/comments`);
            if (responseData && responseData.comments) {
                setComments(responseData.comments);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    }, [postId, sendRequest]);


    // Define a function to trigger a refetch of comments
    const refreshComments = useCallback(() => {
        fetchComments();
    }, [fetchComments]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleCommentAdded = (newComment) => {
        setComments(prevComments => [...prevComments, newComment]);
    };

    const submitCommentHandler = async (event) => {
        event.preventDefault();
        try {
            await sendRequest(
                `http://localhost:4000/api/comments/${postId}/comments`,
                'POST',
                JSON.stringify({
                    content: newCommentContent,
                    userId: auth.userId,
                    postId: postId,
                    parentCommentId: null
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            );

            setNewCommentContent('');
            setShowCommentForm(false);
            fetchComments();  // Refetch comments after submission
        } catch (err) {
            // Handle error
        }
    };

    const Comment = ({ comment, postId, onCommentAdded }) => {
        const auth = useContext(AuthContext);
        
        const [showReplyForm, setShowReplyForm] = useState(false);
        const [showUpdateForm, setShowUpdateForm] = useState(false);
        const [showContent, setShowContent] = useState(true); // State to control content visibility
    
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
                    <Card className="user-item__content author-item" width="100%" height="70px">
                        <div className="user-item__image">
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
                            <h4>{comment.userId.name}</h4>
                            <p>{new Date(comment.createdAt).toLocaleString()}</p>
                        </div>
                        <Button onClick={toggleContent}>
                            {showContent ? 'Hide' : 'Show'}
                        </Button>
                    </Card>
                    {showContent && <ReadMore content={comment.content} maxLength={100} />}
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
                    <div className="comment-replies">
                        {comment.replies && comment.replies.length > 0 && comment.replies.map(reply => (
                            <Comment key={reply?._id} comment={reply} postId={postId} onCommentAdded={onCommentAdded} />
                        ))}
                    </div>
                </Card>
            </React.Fragment>
        );
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && <LoadingSpinner />}
            {!isLoading && (
                <div className="comment-list">
                    <h4>Comments</h4>
                    <Button onClick={() => setShowCommentForm(prev => !prev)}>
                        {showCommentForm ? 'Cancel' : 'New Comment'}
                    </Button>
                    {showCommentForm && (
                        <form className="new-comment-form" onSubmit={submitCommentHandler}>
                            <textarea
                                rows="5"
                                value={newCommentContent}
                                onChange={(e) => setNewCommentContent(e.target.value)}
                                placeholder="Write your comment here..."
                            />
                            <Button type="submit" disabled={!newCommentContent.trim()}>
                                Submit
                            </Button>
                        </form>
                    )}

                    {comments && comments.length > 0 && comments.map(comment => (
                        !comment?.parentCommentId &&
                        <Comment
                            key={comment?._id}
                            comment={comment}
                            postId={postId}
                            onCommentAdded={handleCommentAdded}
                            refreshComments={refreshComments}
                        />
                    ))}
                </div>
            )}
        </React.Fragment>
    );
};

export default CommentList;

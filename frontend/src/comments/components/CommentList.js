import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useHTTPClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Button from '../../shared/components/FormElements/Button';
import Comment from './Comment';
import { AuthContext } from '../../shared/context/auth_context';
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
                        />
                    ))}
                </div>
            )}
        </React.Fragment>
    );
};

export default CommentList;

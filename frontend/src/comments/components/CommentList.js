import React, { useEffect, useState } from 'react';
import { useHTTPClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Button from '../../shared/components/FormElements/Button';
import Comment from './Comment';
import './CommentStyle.css';

const CommentList = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [newCommentContent, setNewCommentContent] = useState('');
    const { isLoading, error, sendRequest, clearError } = useHTTPClient();

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const responseData = await sendRequest(`http://localhost:4000/api/posts/post/${postId}/comments`);
                setComments(responseData.comments);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchComments();
    }, [postId, sendRequest]);

    const handleCommentAdded = (newComment) => {
        setComments((prevComments) => [...prevComments, newComment]);
    };

    const submitCommentHandler = async (event) => {
        event.preventDefault();
        try {
            const responseData = await sendRequest(
                `http://localhost:4000/api/posts/${postId}/comments`,
                'POST',
                JSON.stringify({ content: newCommentContent }),
                { 'Content-Type': 'application/json' }
            );
            handleCommentAdded(responseData.comment);
            setShowCommentForm(false);
            setNewCommentContent('');
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
                    {comments.map(comment => (
                        <Comment key={comment._id} comment={comment} postId={postId} onCommentAdded={handleCommentAdded} />
                    ))}
                </div>
            )}
        </React.Fragment>
    );
};

export default CommentList;

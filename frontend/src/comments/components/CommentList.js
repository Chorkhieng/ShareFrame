import React, { useEffect, useState } from 'react';
import { useHTTPClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Button from '../../shared/components/FormElements/Button';
import Comment from './Comment';
import { AuthContext } from '../../shared/context/auth_context';
import { useContext } from 'react';
import './CommentStyle.css';

const CommentList = ({ postId }) => {
    const auth = useContext(AuthContext);

    const [comments, setComments] = useState([]);
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [newCommentContent, setNewCommentContent] = useState('');
    const { isLoading, error, sendRequest, clearError } = useHTTPClient();

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const responseData = await sendRequest(`http://localhost:4000/api/comments/${postId}/comments`);
                setComments(responseData.comments);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchComments();
    }, [postId, sendRequest]);

    const handleCommentAdded = (newComment) => {
        setComments((prevComments) => {
            const addReplyToParent = (commentsList, parentId, reply) => {
                return commentsList.map(comment => {
                    if (comment._id === parentId) {
                        return {
                            ...comment,
                            replies: [...comment.replies, reply]
                        };
                    } else {
                        return {
                            ...comment,
                            replies: addReplyToParent(comment.replies, parentId, reply)
                        };
                    }
                });
            };

            if (newComment.parentCommentId) {
                return addReplyToParent(prevComments, newComment.parentCommentId, newComment);
            } else {
                return [...prevComments, newComment];
            }
        });
    };

    const submitCommentHandler = async (event) => {
        event.preventDefault();
        try {
            const responseData = await sendRequest(
                `http://localhost:4000/api/comments/${postId}/comments`,
                'POST',
                JSON.stringify(
                    {
                        content: newCommentContent,
                        userId: auth.userId,
                        postId: postId,
                        parentCommentId: null
                      }
                      
                ),
                { 
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + auth.token 
                }
              );

            handleCommentAdded(responseData.comment);
            setShowCommentForm(false);
            setNewCommentContent('');
        } catch (err) {
            // Handle error
        }
    };

    const renderComments = (comments, parentId = null) => {
        return comments
            .filter(comment => comment.parentCommentId === parentId)
            .map(comment => (
                <Comment key={comment._id} comment={comment} postId={postId} onCommentAdded={handleCommentAdded}>
                    {renderComments(comments, comment._id)}
                </Comment>
            ));
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
                    {renderComments(comments)}
                </div>
            )}
        </React.Fragment>
    );
};

export default CommentList;
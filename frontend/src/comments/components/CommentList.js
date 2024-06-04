import React, { useEffect, useState, useCallback } from 'react';
import { useHTTPClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Comment from './Comment';
import './CommentStyle.css'
import NewComment from '../pages/NewComment';

const CommentList = ({ postId }) => {
    const [comments, setComments] = useState([]);
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

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && <LoadingSpinner />}
            {!isLoading && (
                <div className="comment-list">
                    {/* <h5>{comments.length} {comments.length <= 1 ? 
                        ' comment'
                        :
                        ' comments'}
                    </h5> */}
                    <NewComment 
                        postId={postId}
                        onCommentAdded={handleCommentAdded}
                        refreshComments={refreshComments}
                    />

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

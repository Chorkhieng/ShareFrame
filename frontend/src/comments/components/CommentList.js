import React, { useEffect, useState } from 'react';
import { useHTTPClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import NewComment from '../pages/NewComment';
import Comment from './Comment';

const CommentList = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const { isLoading, error, sendRequest, clearError } = useHTTPClient();

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const responseData = await sendRequest(`http://localhost:4000/api/posts/post/${postId}/comments`);
                setComments(responseData.comments);
                console.log("comments: ", responseData.comments)
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchComments();
    }, [postId, sendRequest]);

    const handleCommentAdded = (newComment) => {
        setComments((prevComments) => [...prevComments, newComment]);
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && <LoadingSpinner />}
            {!isLoading && (
                <div>
                    <h2>Comments</h2>
                    <NewComment postId={postId} onCommentAdded={handleCommentAdded} />
                    {comments.map(comment => (
                        <Comment key={comment._id} comment={comment} />
                    ))}
                </div>
            )}
        </React.Fragment>
    );
};

export default CommentList;

import React, { useState, useContext } from 'react';
import Button from '../../shared/components/FormElements/Button';
import { AuthContext } from '../../shared/context/auth_context';
import { useHTTPClient } from '../../shared/hooks/http-hook';

const NewComment = ({ postId, onCommentAdded, refreshComments }) => {
    const auth = useContext(AuthContext);
    const { sendRequest } = useHTTPClient();
    const [newCommentContent, setNewCommentContent] = useState('');
    const [showCommentForm, setShowCommentForm] = useState(false);

    const submitCommentHandler = async (event) => {
        event.preventDefault();
        try {
            const responseData = await sendRequest(
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
            onCommentAdded(responseData.comment); // Notify parent component about the new comment
        } catch (err) {
            // Handle error
        } finally {
            refreshComments(); // refresh to get latest data
        }
    };

    return (
        <div className="new-comment-form">
            <Button onClick={() => setShowCommentForm(prev => !prev)}>
                New Comment
            </Button>
            
            {showCommentForm && (
                <form onSubmit={submitCommentHandler}>
                    <textarea
                        rows="5"
                        value={newCommentContent}
                        onChange={(e) => setNewCommentContent(e.target.value)}
                        placeholder="Write your comment here..."
                    />
                    <Button type="submit" disabled={!newCommentContent.trim()}>
                        Submit
                    </Button>
                    <Button onClick={() => setShowCommentForm(prev => !prev)}>
                        Cancel
                    </Button>
                </form>
            )}
        </div>
    );
};

export default NewComment;

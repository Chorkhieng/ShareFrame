import React, { useState, useContext } from 'react';
import Button from '../../shared/components/FormElements/Button';
import { useHTTPClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth_context';

const DeleteComment = ({ commentId, refreshComments, onDelete }) => {
    const auth = useContext(AuthContext);
    const { sendRequest } = useHTTPClient();
    const [isConfirming, setIsConfirming] = useState(false);

    const startConfirmingHandler = () => {
        setIsConfirming(true);
    };

    const cancelHandler = () => {
        setIsConfirming(false);
    };

    const confirmDeleteHandler = async () => {
        try {
            await sendRequest(
                `http://localhost:4000/api/comments/${commentId}/comments`,
                'DELETE',
                null,
                {
                    Authorization: 'Bearer ' + auth.token
                }
            );
            onDelete(commentId);
            // refreshComments(); // Refresh comments data
        } catch (err) {
            // Handle error
        } finally {
            setIsConfirming(false);
            refreshComments(); // Refresh comments data
        }
    };

    return (
        <React.Fragment>
            {!isConfirming && (
                <Button onClick={startConfirmingHandler}>
                    Delete
                </Button>
            )}
            {isConfirming && (
                <div className="delete-confirmation">
                    <p>Are you sure you want to delete this comment?</p>
                    <Button onClick={confirmDeleteHandler}>Yes</Button>
                    <Button onClick={cancelHandler}>Cancel</Button>
                </div>
            )}
        </React.Fragment>
    );
};

export default DeleteComment;

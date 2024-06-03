import React, { useContext} from 'react';
import Button from '../../shared/components/FormElements/Button';
import { useHTTPClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth_context';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const DeleteComment = ({ commentId, refreshComments, onDelete, cancelHandler }) => {
    const auth = useContext(AuthContext);
    const { isLoading, error, clearError, sendRequest } = useHTTPClient();

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
        } catch (err) { }
        finally {
            refreshComments();
        }
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && <LoadingSpinner asOverlay />}
            <div className="delete-confirmation">
                <p>Are you sure you want to delete this comment?</p>
                <Button onClick={confirmDeleteHandler}>Yes</Button>
                <Button onClick={cancelHandler}>Cancel</Button>
            </div>
        </React.Fragment>
    );
};

export default DeleteComment;

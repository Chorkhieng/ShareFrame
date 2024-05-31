import React, { useContext, useState } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import { AuthContext } from '../../shared/context/auth_context';
import { useHTTPClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import './PostItem.css';
import Avatar from '../../shared/components/UIElements/Avatar'
import ReadMore from '../../shared/hooks/show-less-more-text-hook';
import CommentList from '../../comments/components/CommentList';

const PostItem = props => {
  const { isLoading, error, sendRequest, clearError } = useHTTPClient();
  const auth = useContext(AuthContext);

  const isCurrentUserLiked = props.likes.includes(auth.userId);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLiked, setIsLiked] = useState(isCurrentUserLiked ? 'Unlike' : 'Like');
  const [likeCount, setLikeCount] = useState(props.likeCount);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  // handle date and time
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `http://localhost:4000/api/posts/${props.id}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + auth.token
        }
      );

      props.onDelete(props.id);
      
    }
    catch (err) {}
    
  };

  const handleLike = async () => {
    try {
      // Send a request to like/unlike the post
      const responseData = await sendRequest(
        `http://localhost:4000/api/posts/${props.id}/like`,
        'PATCH', // Use PATCH method to toggle like status
        null,
        {
          Authorization: 'Bearer ' + auth.token
        }
      );

      // Update the like status based on the response
      setIsLiked(responseData.message);
      setLikeCount(responseData.likes);
    } catch (err) {
      // Handle errors
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}

            <Card className="user-item__content author-item">
                <div className="user-item__image">
                  <Avatar 
                    image={`${props.authorImage}`} 
                    alt={props.name}
                    style={{ border: '3px solid purple', borderRadius: '50%'}}
                  />
                </div>
                <div>
                  <h3>{props.authorName}</h3>
                  <p>{formatDate(props.createdAt)}</p>
                </div>
            </Card>


          <div className="place-item__image">
            <img src={`http://localhost:4000/${props.image}`} alt={props.title} />
          </div>

          <div className="place-item__info">
            <Card>
              <h4 className='title-item'>{props.title}</h4>
              <ReadMore content={props.description} maxLength={140} />
            </Card>
          </div>
          {auth.userId && (
            <div className="place-item__actions">
              <Button>
                {likeCount <= 1 ? likeCount + " Like" : likeCount + " Likes"}
              </Button>

              <Button onClick={handleLike} color={isLiked ? 'primary' : 'default'}>
                {isLiked}
              </Button>
              {auth.userId === props.creatorId && 
                <Button to={`/posts/${props.id}`}>
                  Edit
                </Button>
              }
              {auth.userId === props.creatorId &&
                <Button danger onClick={showDeleteWarningHandler}>
                  Delete
                </Button>
              }
            </div>)
          }
          <CommentList postId={props.id} />
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PostItem;

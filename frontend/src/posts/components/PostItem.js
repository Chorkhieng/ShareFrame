import React, { useContext, useState } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import { AuthContext } from '../../shared/context/auth_context';
import { useHTTPClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import './PostItem.css';
import Avatar from '../../shared/components/UIElements/Avatar';
import ReadMore from '../../shared/hooks/show-less-more-text-hook';
import CommentList from '../../comments/components/CommentList';


const getFormattedDate = (dateString) => {
  const date = new Date(dateString);
  const currentDate = new Date();

  // Check if the date is today
  if (date.getDate() === currentDate.getDate() && date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear()) {
      // Format time
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `Today at ${hours}:${minutes}`;
  }

  // Check if the date is yesterday
  const yesterday = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 1);
  if (date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth() && date.getFullYear() === yesterday.getFullYear()) {
      // Format time
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `Yesterday at ${hours}:${minutes}`;
  }

  // Format date to show month, day, year, along with time
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };
  const formattedDate = date.toLocaleString('en-US', options);
  return formattedDate.replace(',', '');
};

const PostItem = props => {
  const { isLoading, error, sendRequest, clearError } = useHTTPClient();
  const auth = useContext(AuthContext);

  const isCurrentUserLiked = props.likes.includes(auth.userId);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLiked, setIsLiked] = useState(isCurrentUserLiked ? 'Unlike' : 'Like');
  const [likeCount, setLikeCount] = useState(props.likeCount);
  const [showComments, setShowComments] = useState(false);

  const [showContent, setShowContent] = useState(true); // State to control content visibility

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const toggleContent = () => {
    setShowContent(prevState => !prevState); // Toggle content visibility
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

          <Card className="user-item__content author-item" width="100%" height="80px">
                <div className="user-item__image">
                    <Avatar 
                        image={props.authorImage} 
                        alt={props.authorName}
                        style={{ 
                            border: '4px solid purple', 
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px'
                        }}
                    />
                </div>
                <div className="comment-details">
                    <h3>{props.authorName}</h3>
                    <p>{getFormattedDate(props.createdAt)}</p>
                </div>

                <button onClick={toggleContent}>
                    {showContent ? 'Hide' : 'Show'}
                </button>
            </Card>

          <div className="place-item__image" style={{ display: showContent ? 'block' : 'none' }}>
            <img src={`http://localhost:4000/${props.image}`} alt={props.title} />
          </div>

          <div className="place-item__info" style={{ display: showContent ? 'block' : 'none' }}>
            <Card>
              <h4 className='title-item' style={{ display: showContent ? 'block' : 'none' }} >{props.title}</h4>
              <ReadMore content={props.description} maxLength={140} />
            </Card>
          </div>
          {auth.userId && (
            <div className="place-item__actions" style={{ display: showContent ? 'block' : 'none' }}>
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
            </div>
          )}
          <button center onClick={() => setShowComments(!showComments)} >
            {showComments ? 'Hide Comments' : 'Show Comments'}
          </button>
          {showComments && <CommentList postId={props.id} />}
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PostItem;

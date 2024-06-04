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
import { getFormattedDate } from '../../shared/util/date-time-format';

const PostItem = props => {
  const { isLoading, error, sendRequest, clearError } = useHTTPClient();
  const auth = useContext(AuthContext);

  const isCurrentUserLiked = props.likes.includes(auth.userId);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLiked, setIsLiked] = useState(isCurrentUserLiked ? 'Unlike' : 'Like');
  const [likeCount, setLikeCount] = useState(props.likeCount);
  const [showComments, setShowComments] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const [selectedOption, setSelectedOption] = useState('');

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    if (option === 'Show Content') {
      setShowContent(true);
    } else if (option === 'Hide Content') {
      setShowContent(false);
    } else if (option === 'Show Comments') {
      setShowComments(true);
    } else if (option === 'Hide Comments') {
      setShowComments(false);
    } else if (option === 'Edit') {
      window.location.href = `/posts/${props.id}`;
    } else if (option === 'Delete') {
      showDeleteWarningHandler();
    }
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
    } catch (err) {}
  };

  const handleLike = async () => {
    try {
      const responseData = await sendRequest(
        `http://localhost:4000/api/posts/${props.id}/like`,
        'PATCH',
        null,
        {
          Authorization: 'Bearer ' + auth.token
        }
      );
      setIsLiked(responseData.message);
      setLikeCount(responseData.likes);
    } catch (err) {}
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

            <select className="select-wrapper-post" value={selectedOption} onChange={(e) => handleOptionSelect(e.target.value)}>
              <option value="">
                ●●●
              </option>
              <option value={showContent ? "Hide Content" : "Show Content"}>
                {showContent ? "Hide Content" : "Show Content"}
              </option>
              <option value={showComments ? "Hide Comments" : "Show Comments"}>
                {showComments ? "Hide Comments" : "Show Comments"}
              </option>
              {auth.userId === props.creatorId && (
                <>
                  <option value="Edit">Edit</option>
                  <option value="Delete">Delete</option>
                </>
              )}
            </select>
          </Card>

          <div className="place-item__image" style={{ display: showContent ? 'block' : 'none' }}>
            <img src={`http://localhost:4000/${props.image}`} alt={props.title} />
          </div>

          <div className="place-item__info" style={{ display: showContent ? 'block' : 'none' }}>
            <Card>
              <h4 className='title-item'>{props.title}</h4>
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
            </div>
          )}
          {showComments && <CommentList postId={props.id} />}
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PostItem;

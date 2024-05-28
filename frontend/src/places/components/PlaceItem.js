import React, { useContext, useState } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import { AuthContext } from '../../shared/context/auth_context';
import { useHTTPClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import './PlaceItem.css';
import Avatar from '../../shared/components/UIElements/Avatar'
import ReadMore from '../../shared/hooks/show-less-more-text-hook';

const PlaceItem = props => {
  const { isLoading, error, sendRequest, clearError } = useHTTPClient();
  const auth = useContext(AuthContext);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `http://localhost:4000/api/places/${props.id}`,
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
                  <Avatar image={`${props.authorImage}`} alt={props.name} />
                </div>
                <div>
                  <h3>{props.authorName}</h3>
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
              <Button /* { onClick={handleLike}}  */ >
                React
              </Button>
              {auth.userId === props.creatorId && 
                <Button to={`/places/${props.id}`}>
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
          
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;

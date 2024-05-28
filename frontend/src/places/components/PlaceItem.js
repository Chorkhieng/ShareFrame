import React, { useContext, useState } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import { AuthContext } from '../../shared/context/auth_context';
import { useHTTPClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import './PlaceItem.css';
import Avatar from '../../shared/components/UIElements/Avatar';
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

          <div className="place-item__info">
            {/* <h1>{props.creatorName}</h1> TODO */}
            <Card>
              <h3 className="user-item__image">
                <Avatar image={`http://localhost:4000/${props.image}`} alt={props.title}/>
              </h3>
            </Card>
          </div>

          <div className="place-item__image">
            <img src={`http://localhost:4000/${props.image}`} alt={props.title} />
          </div>

          <div className="place-item__info">
            <Card>
              <h3 >{props.address}</h3>
              <ReadMore content={props.description} maxLength={140} />
            </Card>
          </div>

          {auth.userId === props.creatorId && 
            (<div className="place-item__actions">
              <Button to={`/places/${props.id}`}>
                EDIT
              </Button>
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            </div>)
          }
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;

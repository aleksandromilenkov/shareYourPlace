import React, { useContext, useState } from "react";
import Card from "../../shared/components/UIComponents/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIComponents/Modal";
import Map from "../../shared/components/UIComponents/Map";
import "./PlaceItem.css";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import LoadingSpinner from "../../shared/components/UIComponents/LoadingSpinner";
import ErrorModal from "../../shared/components/UIComponents/ErrorModal";

const PlaceItem = (props) => {
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [warningModal, setDeleteWarningModal] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const history = useHistory();
  const openMapHandler = () => {
    setShowMap(true);
  };
  const closeMapHandler = () => {
    setShowMap(false);
  };
  const showDeleteWarningHandler = () => {
    setDeleteWarningModal(true);
  };
  const cancelDeleteWarningHandler = () => {
    setDeleteWarningModal(false);
  };
  const confirmDeleteHandler = async () => {
    setDeleteWarningModal(false);
    console.log("Deleting...");
    try {
      const data = await sendRequest(
        `http://localhost:5000/api/places/${props.id}`,
        "DELETE"
      );
      console.log(data);
      props.onDelete(props.id);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />

      <Modal
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        onSubmit={closeMapHandler}
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
        show={showMap}
        onCancel={closeMapHandler}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={warningModal}
        header={"Are you sure?"}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={
          <>
            <Button onClick={cancelDeleteWarningHandler} inverse>
              CANCEL
            </Button>
            <Button onClick={confirmDeleteHandler} danger>
              DELETE
            </Button>
          </>
        }
        onCancel={cancelDeleteWarningHandler}
      >
        <div>
          <h2>Do you want to delete this place?</h2>
        </div>
      </Modal>

      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && (
            <div className="center">
              <LoadingSpinner asOverlay />
            </div>
          )}
          <div className="place-item__image">
            <img src={props.image} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {auth.userId === props.creatorId && (
              <Button to={`/places/${props.id}`}>EDIT</Button>
            )}
            {auth.userId === props.creatorId && (
              <Button onClick={showDeleteWarningHandler} danger>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </>
  );
};

export default PlaceItem;

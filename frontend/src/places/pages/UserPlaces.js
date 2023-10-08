import React, { useEffect, useState } from "react";
import PlaceList from "../components/PlaceList";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import LoadingSpinner from "../../shared/components/UIComponents/LoadingSpinner";
import ErrorModal from "../../shared/components/UIComponents/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";

const UserPlaces = () => {
  const [userPlaces, setUserPlaces] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const userId = useParams().userId;
  useEffect(() => {
    const fetchUserPlaces = async () => {
      try {
        const data = await sendRequest(
          `http://localhost:5000/api/places/user/${userId}`
        );
        setUserPlaces(data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserPlaces();
  }, []);
  const deletePlaceHandler = (placeId) => {
    setUserPlaces((prevData) => {
      return prevData.filter((p) => p.id !== placeId);
    });
  };
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && userPlaces && (
        <PlaceList items={userPlaces} onDelete={deletePlaceHandler} />
      )}
    </>
  );
};

export default UserPlaces;

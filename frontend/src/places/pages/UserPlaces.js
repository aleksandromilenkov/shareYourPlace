import React, { useEffect, useState } from "react";
import PlaceList from "../components/PlaceList";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import LoadingSpinner from "../../shared/components/UIComponents/LoadingSpinner";
import ErrorModal from "../../shared/components/UIComponents/ErrorModal";

const UserPlaces = () => {
  const [userPlaces, setUserPlaces] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const userId = useParams().userId;
  useEffect(() => {
    try {
      const fetchUserPlaces = async () => {
        setIsLoading(true);
        const resp = await fetch(
          `http://localhost:5000/api/places/user/${userId}`
        );
        const data = await resp.json();
        console.log(resp);
        if (!resp.ok) {
          throw new Error(data.message || "Can't fetch places for this user");
        }
        console.log(data);
        return data.data;
      };
      fetchUserPlaces()
        .then((data) => {
          setIsLoading(false);
          setUserPlaces(data);
        })
        .catch((err) => setError(err));
    } catch (err) {}
  }, []);
  const errorHandler = () => {
    setError(null);
    setIsLoading(false);
  };
  return (
    <>
      <PlaceList items={userPlaces} />
    </>
  );
};

export default UserPlaces;

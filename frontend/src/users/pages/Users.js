import React, { useEffect, useState } from "react";
import UsersList from "../components/UsersList";
import LoadingSpinner from "../../shared/components/UIComponents/LoadingSpinner";
import ErrorModal from "../../shared/components/UIComponents/ErrorModal";
const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    try {
      const fetchUsers = async () => {
        setIsLoading(true);
        const resp = await fetch("http://localhost:5000/api/users");
        const data = await resp.json();
        if (!resp.ok) {
          throw new Error(data?.message || "Can't fetch users");
        }
        console.log(data);
        return data.data;
      };
      fetchUsers()
        .then((data) => {
          setIsLoading(false);
          setUsers(data);
        })
        .catch((err) => {
          setError(err.message || "Cant fetch Users");
          console.log(err);
        });
    } catch (err) {
      setError(err.message || "Something went wrong");
      console.log(err);
    }
  }, []);
  const errorHandler = () => {
    setError(null);
    setIsLoading(false);
  };
  return (
    <>
      {error && <ErrorModal error={error} onClear={errorHandler} />}
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}{" "}
      {!isLoading && users && <UsersList items={users} />}
    </>
  );
};

export default Users;

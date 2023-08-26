import React from "react";
import "./UsersList.css";
import UserItem from "./UserItem";
const UsersList = (props) => {
  if (props.items.lenght) {
    return (
      <div className="center">
        <h2>No users found</h2>
      </div>
    );
  }
  return (
    <ul className="users-list">
      {props.items.map((user, idx) => (
        <UserItem
          key={idx}
          id={user.id}
          image={user.image}
          name={user.name}
          placeCount={user.places}
        />
      ))}
    </ul>
  );
};

export default UsersList;

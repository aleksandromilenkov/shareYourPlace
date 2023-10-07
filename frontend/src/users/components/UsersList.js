import React from "react";
import UserItem from "./UserItem";
import Card from "../../shared/components/UIComponents/Card";
import "./UsersList.css";
const UsersList = (props) => {
  console.log(props.items);
  if (!props.items?.length) {
    return (
      <div className="center">
        <Card>
          <h2>No users found</h2>
        </Card>
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

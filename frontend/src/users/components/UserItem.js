import React from "react";
import "./UserItem.css";
import Avatar from "../../shared/components/UIComponents/Avatar";
import Card from "../../shared/components/UIComponents/Card";
import { Link } from "react-router-dom";
const UserItem = ({ id, name, image, placeCount }) => {
  console.log(placeCount);
  return (
    <li className="user-item">
      <Card className="user-item__content">
        <Link to={`/${id}/places`}>
          <div className="user-item__image">
            <Avatar image={`http://localhost:5000/${image}`} alt={name} />
          </div>
          <div className="user-item__info">
            <h2>{name}</h2>
            <h3>
              {placeCount.length} {placeCount.length === 1 ? "Place" : "Places"}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;

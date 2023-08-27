import React from "react";
import "./PlaceList.css";
import Card from "../../shared/components/UIComponents/Card";
import PlaceItem from "./PlaceItem";

const PlaceList = (props) => {
  if (!props.items?.length) {
    return (
      <div className="place-list centered">
        <Card>
          <h2>No places found</h2>
          <button>Share a place</button>
        </Card>
      </div>
    );
  }
  return (
    <ul className="place-list">
      {props.items.map((place) => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.imageUrl}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator}
          coordinates={place.location}
        />
      ))}
    </ul>
  );
};

export default PlaceList;

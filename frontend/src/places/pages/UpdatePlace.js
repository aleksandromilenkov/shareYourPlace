import React from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
  validate,
} from "../../shared/utils/validators";
import "./PlaceForm.css";
import { useForm } from "../../shared/hooks/form-hook";

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empile State",
    description: "scy scraper big",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIP0NXvv5YbGKbuGsC425k3eh5ZX7y8dH5og&usqp=CAU",
    address: "New York, New York, USA",
    location: {
      lat: 40.74854,
      lng: -73.98732,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Empile State",
    description: "scy scraper big",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIP0NXvv5YbGKbuGsC425k3eh5ZX7y8dH5og&usqp=CAU",
    address: "New York, New York, USA",
    location: {
      lat: 40.74854,
      lng: -73.98732,
    },
    creator: "u2",
  },
];

const UpdatePlace = () => {
  const placeId = useParams().placeId;
  const identifierPlace = DUMMY_PLACES.find((p) => p.id === placeId);
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: identifierPlace.title,
        isValid: true,
      },
      description: {
        value: identifierPlace.description,
        isValid: true,
      },
      address: {
        value: identifierPlace.address,
        isValid: true,
      },
    },
    true
  );
  const placeSubmitHandler = (e) => {
    e.preventDefault();
    console.log(formState);
  };
  if (!identifierPlace) {
    return (
      <div className="centered">
        <h2>Couldn't find the place</h2>
      </div>
    );
  }
  return (
    <form className="place-form" onSubmit={placeSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Place enter valid title"
        onInput={inputHandler}
        initialValue={identifierPlace.title}
        initialIsValid={formState.inputs.title.isValid}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Place enter valid description (Min 5 characters)"
        onInput={inputHandler}
        initialValue={identifierPlace.description}
        initialIsValid={formState.inputs.description.isValid}
      />
      <Button type="submit" disabled={!formState.isValid}>
        UPDATE PLACE
      </Button>
    </form>
  );
};

export default UpdatePlace;

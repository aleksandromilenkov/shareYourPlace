import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/utils/validators";
import "./PlaceForm.css";
import { useForm } from "../../shared/hooks/form-hook";
import Card from "../../shared/components/UIComponents/Card";

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
    title: "Emp. State",
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
  const [isLoading, setIsLoading] = useState(true);
  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: true,
      },
      description: {
        value: "",
        isValid: true,
      },
      address: {
        value: "",
        isValid: true,
      },
    },
    false
  );
  const identifierPlace = DUMMY_PLACES.find((p) => p.id === placeId);
  useEffect(() => {
    if (identifierPlace) {
      setFormData(
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
    }

    setIsLoading(false);
  }, [identifierPlace, setFormData]);

  const placeSubmitHandler = (e) => {
    e.preventDefault();
    console.log(formState);
  };
  if (!identifierPlace) {
    return (
      <div class="center">
        <Card>
          <h2>Couldn't find the place</h2>
        </Card>
        ;
      </div>
    );
  }
  if (isLoading) {
    return (
      <div class="center">
        <Card>
          <h2>Loading...</h2>
        </Card>
        ;
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
        initialValue={formState.inputs.title.value}
        initialIsValid={formState.inputs.title.isValid}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Place enter valid description (Min 5 characters)"
        onInput={inputHandler}
        initialValue={formState.inputs.description.value}
        initialIsValid={formState.inputs.description.isValid}
      />
      <Button type="submit" disabled={!formState.isValid}>
        UPDATE PLACE
      </Button>
    </form>
  );
};

export default UpdatePlace;

import React, { useContext } from "react";
import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/utils/validators";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/form-hook";
import "./PlaceForm.css";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIComponents/ErrorModal";
import LoadingSpinner from "../../shared/components/UIComponents/LoadingSpinner";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const NewPlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, InputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      lat: {
        value: null,
        isValid: false,
      },
      lng: {
        value: null,
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const history = useHistory();

  const placeSubmitHandler = async (e) => {
    e.preventDefault();
    console.log(formState);
    try {
      const formData = new FormData();
      formData.append("address", formState.inputs.address.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("title", formState.inputs.title.value);
      formData.append("lat", formState.inputs.lat.value);
      formData.append("lng", formState.inputs.lng.value);
      formData.append("image", formState.inputs.image.value);
      formData.append("creator", auth.userId);
      console.log(formState.inputs);
      const data = await sendRequest(
        "http://localhost:5000/api/places",
        "POST",
        formData,
        { Authorization: `Bearer ${auth.token}` }
      );
      console.log(data);
      history.push("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {error && <ErrorModal error={error} onClear={clearError} />}
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && (
        <form className="place-form" onSubmit={placeSubmitHandler}>
          <Input
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Place enter a valid Title"
            onInput={InputHandler}
            id="title"
          />
          <ImageUpload
            id="image"
            center
            onInput={InputHandler}
            errorText="Please provide an image"
          />
          <Input
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Place enter a valid description (at least 5 characters)"
            onInput={InputHandler}
            id="description"
          />
          <Input
            element="input"
            type="number"
            label="Lattitude"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Place enter a valid lattitude"
            onInput={InputHandler}
            id="lat"
          />
          <Input
            element="input"
            type="number"
            label="Longitude"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Place enter a valid Longitude"
            onInput={InputHandler}
            id="lng"
          />
          <Input
            element="input"
            type="text"
            label="Address"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Place enter a valid Address"
            onInput={InputHandler}
            id="address"
          />
          <Button type="submit" disabled={!formState.isValid}>
            ADD PLACE
          </Button>
        </form>
      )}
    </>
  );
};

export default NewPlace;

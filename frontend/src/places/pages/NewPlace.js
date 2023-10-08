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
      address: {
        value: "",
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
      const data = await sendRequest(
        "http://localhost:5000/api/places",
        "POST",
        {
          address: formState.inputs.address.value,
          description: formState.inputs.description.value,
          title: formState.inputs.title.value,
          image: "asdasdasd",
          location: { lat: 43.3245, lng: 22.42525 },
          creator: auth.userId,
        },
        {
          "Content-Type": "application/json",
        }
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
          <Input
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Place enter a valid description (at least 5 characters)"
            onInput={InputHandler}
            id="description"
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

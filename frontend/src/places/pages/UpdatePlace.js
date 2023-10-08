import React, { useContext, useEffect, useState } from "react";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/utils/validators";
import "./PlaceForm.css";
import { useForm } from "../../shared/hooks/form-hook";
import Card from "../../shared/components/UIComponents/Card";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIComponents/LoadingSpinner";
import ErrorModal from "../../shared/components/UIComponents/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";

const UpdatePlace = () => {
  const context = useContext(AuthContext);
  const placeId = useParams().placeId;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [identifierPlace, setIdentifierPlace] = useState(null);
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
  const history = useHistory();
  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const data = await sendRequest(
          `http://localhost:5000/api/places/${placeId}`
        );
        if (data.data) {
          setFormData(
            {
              title: {
                value: data.data.title,
                isValid: true,
              },
              description: {
                value: data.data.description,
                isValid: true,
              },
              address: {
                value: data.data.address,
                isValid: true,
              },
            },
            true
          );
        }
        setIdentifierPlace(data.data);
      } catch (err) {
        setIdentifierPlace(null);
        console.log(err);
      }
    };
    fetchPlace();
  }, [setFormData, placeId, sendRequest]);

  const placeSubmitHandler = (e) => {
    e.preventDefault();
    console.log(formState);
    const updateThePlace = async () => {
      try {
        const data = await sendRequest(
          `http://localhost:5000/api/places/${placeId}`,
          "PATCH",
          JSON.stringify({
            title: formState.inputs.title.value,
            description: formState.inputs.description.value,
          }),
          { "Content-Type": "application/json" }
        );
        console.log(data);
        history.push(`/${context.userId}/places`);
      } catch (err) {
        console.log(err);
      }
    };
    updateThePlace();
  };
  if (!identifierPlace && !error) {
    return (
      <div class="center">
        {isLoading && (
          <div className="center">
            <LoadingSpinner asOverlay />
          </div>
        )}
        {!isLoading && (
          <Card>
            <h2>Couldn't find the place</h2>
          </Card>
        )}
        ;
      </div>
    );
  }

  return (
    <>
      {error && <ErrorModal error={error} onClear={clearError} />}
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && identifierPlace && (
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
      )}
    </>
  );
};

export default UpdatePlace;

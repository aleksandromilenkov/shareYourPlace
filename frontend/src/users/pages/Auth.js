import React, { useContext, useState } from "react";
import Input from "../../shared/components/FormElements/Input";
import { useForm } from "../../shared/hooks/form-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/utils/validators";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIComponents/Card";
import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIComponents/LoadingSpinner";
import ErrorModal from "../../shared/components/UIComponents/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const Auth = () => {
  const auth = useContext(AuthContext);
  const [mode, setMode] = useState("login");
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  const authSubmitHandler = async (e) => {
    e.preventDefault();
    console.log(formState.inputs);
    if (mode === "login") {
      try {
        const data = await sendRequest(
          "http://localhost:5000/api/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        console.log(data);
        auth.login(data.data.id);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const formData = new FormData();
        formData.append("email", formState.inputs.email.value);
        formData.append("name", formState.inputs.name.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);
        const data = await sendRequest(
          "http://localhost:5000/api/users/signup",
          "POST",
          formData
        );
        console.log(data);
        auth.login(data.userId);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const switchModeHandler = () => {
    console.log(mode);
    if (mode !== "login") {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
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
    }

    setMode((prevMode) => {
      return prevMode === "login" ? "signup" : "login";
    });
  };

  const displayedForm =
    mode === "login" ? (
      <>
        <h2>Login Required</h2>
        {isLoading && <LoadingSpinner asOverlay />}
        <hr />
        <form onSubmit={authSubmitHandler}>
          <Input
            id="email"
            element="input"
            type="email"
            label="E-mail"
            errorText="Place enter valid email address"
            onInput={inputHandler}
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
            initialValue={formState.inputs.email.value}
            initialIsValid={formState.inputs.email.isValid}
          />
          <Input
            id="password"
            element="input"
            label="Password"
            type="password"
            errorText="Place enter valid password (Min 5 characters)"
            onInput={inputHandler}
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
            initialValue={formState.inputs.password.value}
            initialIsValid={formState.inputs.password.isValid}
          />
          <Button type="submit" disabled={!formState.isValid}>
            LOGIN
          </Button>
        </form>
        <div>
          Don't have an account?
          <button onClick={switchModeHandler} className="switchModeBtn">
            Signup here
          </button>
        </div>
      </>
    ) : (
      <>
        {" "}
        <h2>Signup Required</h2>
        {isLoading && <LoadingSpinner asOverlay />}
        <hr />
        <form onSubmit={authSubmitHandler}>
          <Input
            id="name"
            element="input"
            type="text"
            label="Your Name"
            errorText="Place enter a name"
            onInput={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
            initialValue={formState.inputs.name?.value}
            initialIsValid={formState.inputs.name?.isValid}
          />
          <ImageUpload
            id="image"
            center
            onInput={inputHandler}
            errorText="Please provide an image"
          />
          <Input
            id="email"
            element="input"
            type="email"
            label="E-mail"
            errorText="Place enter valid email address"
            onInput={inputHandler}
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
            initialValue={formState.inputs.email?.value}
            initialIsValid={formState.inputs.email?.isValid}
          />
          <Input
            id="password"
            element="input"
            label="Password"
            type="password"
            errorText="Place enter valid password (Min 6 characters)"
            onInput={inputHandler}
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(6)]}
            initialValue={formState.inputs.password?.value}
            initialIsValid={formState.inputs.password?.isValid}
          />
          <Button type="submit" disabled={!formState.isValid}>
            SIGNUP
          </Button>
        </form>
        <div>
          Already have an account?
          <button onClick={switchModeHandler} className="switchModeBtn">
            Login here
          </button>
        </div>
      </>
    );
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">{displayedForm}</Card>
    </>
  );
};

export default Auth;

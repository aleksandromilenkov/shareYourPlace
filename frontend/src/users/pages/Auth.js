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

const Auth = () => {
  const auth = useContext(AuthContext);
  const [mode, setMode] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
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
    setIsLoading(true);
    if (mode === "login") {
    } else {
      try {
        const resp = await fetch("http://localhost:5000/api/users/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
        });
        console.log(resp);
        const data = await resp.json();
        setIsLoading(false);
        if (!resp.ok) {
          throw new Error(data.message);
        }
        auth.login();
        console.log(formState);
        console.log(data);
      } catch (err) {
        console.log(err);
        setError(err.message || "Something went wrong");
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
        },
        false
      );
    }

    setMode((prevMode) => {
      return prevMode === "login" ? "signup" : "login";
    });
  };

  const errorHandler = () => {
    setError(null);
  };

  const displayedForm =
    mode === "login" ? (
      <>
        <h2>Login Required</h2>
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
            errorText="Place enter valid password (Min 5 characters)"
            onInput={inputHandler}
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
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
      <ErrorModal error={error} onClear={errorHandler} />
      <Card className="authentication">{displayedForm}</Card>
    </>
  );
};

export default Auth;

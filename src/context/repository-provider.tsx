import {
  FormsAuthenticationService,
  LoginState,
  Repository
} from "@sensenet/client-core";
import { RepositoryContext } from "@sensenet/hooks-react";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { FullScreenLoader } from "../components/full-screen-loader";
import { LoginForm } from "../components/login-form";

export const repository = new Repository({
  repositoryUrl: process.env.REACT_APP_REPOSITORY_URL
});

/**
 * Container component that will provide a Repository object through a Context
 */
export const RepositoryProvider = ({ children }: PropsWithChildren<{}>) => {
  const [loginError, setLoginError] = useState("");
  const [loginState, setLoginState] = useState(LoginState.Unknown);

  useEffect(() => {
    FormsAuthenticationService.Setup(repository);

    const observable = repository.authentication.state.subscribe(state => {
      setLoginState(state);
      if (state === LoginState.Authenticated) {
        repository.reloadSchema()
      }
    }, true);
    return () => observable.dispose();
  }, []);

  return (
    <RepositoryContext.Provider value={repository}>
      {loginState === LoginState.Pending ? <FullScreenLoader /> : null}
      {loginState === LoginState.Authenticated ? children : null}
      {loginState === LoginState.Unauthenticated ||
      loginState === LoginState.Unknown ? (
        <LoginForm
          error={loginError}
          onLogin={async (username, password) => {
            try {
              setLoginError("");
              const result = await repository.authentication.login(
                username,
                password
              );
              if (!result) {
                setLoginError("Failed to log in.");
              }
            } catch (error) {
              setLoginError(error.message);
            }
          }}
        />
      ) : null}
    </RepositoryContext.Provider>
  );
};

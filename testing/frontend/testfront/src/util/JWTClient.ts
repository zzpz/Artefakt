import { CognitoIdToken, CognitoUserSession } from "amazon-cognito-identity-js";
import axios, { AxiosInstance, CreateAxiosDefaults } from "axios";

export const createClientFromSession = (
  session: CognitoUserSession,
  url: string,
) => {
  const bearer_token: string = session.getIdToken().getJwtToken();
  var bearer: string = `Bearer ${bearer_token}`;
  const config: CreateAxiosDefaults = {
    headers: { Authorization: bearer },
  };

  const client: AxiosInstance = axios.create(
    {
      url: url,
      headers: config.headers,
    },
  );

  return client;
};

export const createAPIClientFromSession = (session: CognitoUserSession) => {
  const baseURL: string = "https://api.qura.website";

  const bearer_token: string = session.getIdToken().getJwtToken();
  var bearer: string = `Bearer ${bearer_token}`;
  const config: CreateAxiosDefaults = {
    baseURL,
    headers: { Authorization: bearer },
  };

  const client: AxiosInstance = axios.create(
    {
      baseURL: config.baseURL,
      headers: config.headers,
    },
  );

  return client;
};

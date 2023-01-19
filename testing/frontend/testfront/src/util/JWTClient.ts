import { CognitoIdToken, CognitoUserSession } from "amazon-cognito-identity-js";
import axios, { AxiosInstance, CreateAxiosDefaults } from "axios";

export const createClientFromSession = (session: CognitoUserSession) => {
  const baseURL: string = "https://api.qura.website";

  const bearer_token: string = session.getIdToken().getJwtToken();
  var bearer: string = `Bearer ${bearer_token}`;
  console.log("JWT Request made: ", bearer);
  const config: CreateAxiosDefaults = {
    baseURL,
    headers: { "Authorization": bearer },
  };

  const client: AxiosInstance = axios.create(
    { ...config },
  );

  return client;
};

import {
  CognitoUserPool,
  ICognitoUserPoolData,
} from "amazon-cognito-identity-js";

const poolID: string = process.env.REACT_APP_USER_POOL_ID || "pool_id";
const clientID: string = process.env.REACT_APP_USER_POOL_CLIENT_ID ||
  "client_id";

const CognitoUserPoolData: ICognitoUserPoolData = {
  UserPoolId: poolID,
  ClientId: clientID,
};

//set up our userpool we will be authenticating accounts against
const UserPool: CognitoUserPool = new CognitoUserPool(CognitoUserPoolData);

export { UserPool };

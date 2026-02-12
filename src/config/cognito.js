import { Amplify } from "aws-amplify";

const region = import.meta.env.VITE_COGNITO_REGION || "us-east-1";
const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID;
const userPoolClientId = import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID;
const userPoolEndpoint = import.meta.env.VITE_COGNITO_ENDPOINT;

if (!userPoolId || !userPoolClientId) {
  console.warn(
    `Missing Cognito config for region ${region}. Set VITE_COGNITO_USER_POOL_ID and VITE_COGNITO_USER_POOL_CLIENT_ID.`,
  );
}

const cognitoConfig = {
  userPoolId,
  userPoolClientId,
  loginWith: {
    email: true,
  },
};

if (userPoolEndpoint) {
  cognitoConfig.userPoolEndpoint = userPoolEndpoint;
}

Amplify.configure({
  Auth: {
    Cognito: cognitoConfig,
  },
});

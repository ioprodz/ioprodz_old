import axios from "axios";
import config from "../app/config";

const { authGithubClientId, authGithubClientSecret } = config;

const OAuthBaseUrl = "https://github.com/login/oauth";

export const getAuthUrl = () =>
  `${OAuthBaseUrl}/authorize?client_id=${authGithubClientId}`;

const extreactToken = (data: string): string =>
  (data.split("=")[1] as string).split("&")[0] as string;
export const getAccessToken = (code: string) => {
  const params = {
    client_id: authGithubClientId,
    client_secret: authGithubClientSecret,
    code,
  };
  return axios
    .post(`${OAuthBaseUrl}/access_token`, "", {
      params,
    })
    .then(({ data }) => extreactToken(data));
};

export const getUserData = (token: string) =>
  axios.get("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

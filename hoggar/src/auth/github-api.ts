import axios from "axios";
import { CLIENT_SECRET, CLIENT_ID } from "../app/config";

const OAuthBaseUrl = "https://github.com/login/oauth/";

export const getAuthUrl = () =>
  "https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID;

export const getAccessToken = (code: string) => {
  const params = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code,
  };
  return axios.post(`${OAuthBaseUrl}/access_token`, "", {
    params,
  });
};

export const getUserData = (token: string) =>
  axios.get("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

import { NextFunction, Request, Response, Router } from "express";
import axios from "axios";

const CLIENT_ID = "6bacd8943692208dfe77";

const auth = Router();

auth.get("/github", (_: Request, res: Response, next: NextFunction) => {
  const url = "https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID;
  try {
    res.redirect(url);
  } catch (e: any) {
    next({ ...e, status: 404 });
  }
  return;
});

auth.get(
  "/github/callback",
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("i am in callback");
    const { code } = req.query;
    const params = {
      client_id: CLIENT_ID,
      client_secret: "bd59bd86c0d12106f3afe9cf29b99c5460a62547",
      code: code,
    };
    const token = await axios
      .post("https://github.com/login/oauth/access_token", "", {
        params: params,
      })
      .then(async (data) => {
        console.log(data.data);
        return data.data;
      })
      .catch((e: any) => {
        next({ ...e, status: 404 });
      });
    console.log(token);
    const sendtoken = token.toString().split("=")[1].split("&")[0];
    const userData = await getUserData(sendtoken);
    res.send(userData);
  }
);

const getUserData = async (token: string) => {
  const url = "https://api.github.com/user";
  try {
    const userData = await axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        return res.data;
      });
    console.log(userData);
    return userData;
  } catch (e: any) {
    console.log(e);
  }
};

export default auth;

/*
    1- seacrch for user and get user data 


    2- search fro user in db 
    4- create user if not exist 
    3- token & refrech token 

    */

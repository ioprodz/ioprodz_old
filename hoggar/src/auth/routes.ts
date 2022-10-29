import { NextFunction, Request, Response, Router } from "express";

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
  (req: Request, res: Response, next: NextFunction) => {
    console.log(req.query);
    /*after get this code , send post to get acces token to 
    POST https://github.com/login/oauth/access_token
    after
    send get user with acces_token
    
    */
 
    return req;

    /*
    1- seacrch for user and get user data 
    2- search fro user in db 
    4- create user if not exist 
    3- token & refrech token 

    */
  }
);
auth.post("/refresh", () => {


  return null;
});

export default auth;

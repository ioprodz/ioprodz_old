import { NextFunction, Request, Response, Router } from "express";
import { addSubscription } from "./business";

const subscription = Router();

subscription.post(
  "/subscription",
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, source } = req.body;
    try {
      const added = await addSubscription(email, source);
      res.status(201).send(added);
    } catch (e: any) {
      if (e.name === "ValidationError") {
        next({ ...e, status: 403 });
      }
      next({ ...e, status: 409 });
    }
  }
);

export default subscription;

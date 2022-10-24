import React from "react";

import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Auth } from "./screens/Auth";
import { Error } from "./screens/Error";
import { LandingPage } from "./screens/LandingPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" errorElement={<Error />}>
      <Route path="/" element={<LandingPage />}></Route>
      <Route path="/auth" element={<Auth />} />
    </Route>
  )
);

export const Routes: React.FC = () => {
  return <RouterProvider router={router} />;
};

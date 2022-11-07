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
import { Layout } from "./screens/Layout";
import { Profile } from "./screens/Profile";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" errorElement={<Error />}>
      <Route
        path="/"
        element={
          <Layout>
            <LandingPage />
          </Layout>
        }
      ></Route>
      <Route
        path="/auth"
        element={
          <Layout>
            <Auth />
          </Layout>
        }
      />
      <Route
        path="/profile"
        element={
          <Layout>
            <Profile />
          </Layout>
        }
      />
    </Route>
  )
);

export const Routes: React.FC = () => {
  return <RouterProvider router={router} />;
};

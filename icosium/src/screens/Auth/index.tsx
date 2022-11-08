import React from "react";
import { useSearchParams } from "react-router-dom";
import { useGithubAuthQuery } from "../../shared/queries";

export const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const authCode = searchParams.get("code");
  const { isLoading, error } = useGithubAuthQuery(authCode as string);
  console.log(error);
  return (
    <div className="w-1/3 mx-auto">
      {!authCode || !isLoading || !!error ? (
        <div className="w-full">
          <h1 className="text-3xl pt-8">Login</h1>
          <a
            className="block border-2 border-gray-400 w-full text-center pt-2 text-2xl h-14 mt-5 rounded   hover:border-black"
            href={`${process.env.REACT_APP_API_URL}/auth/github`}
          >
            Github
          </a>
          {!!error && <p>Auth error</p>}
        </div>
      ) : (
        <>
          <h1>Loading</h1>
        </>
      )}
    </div>
  );
};

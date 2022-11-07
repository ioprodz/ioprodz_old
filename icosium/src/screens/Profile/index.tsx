import React from "react";
import { useMyProfileQuery } from "../../shared/queries";

export const Profile: React.FC = () => {
  const { data, isLoading } = useMyProfileQuery();
  return (
    <>
      <h1 className="text-3xl mx-5">Profile</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-row">
          <div>
            <img
              className="w-52 rounded-3xl mx-2"
              src={data?.avatarUrl}
              alt=""
            />
          </div>
          <div>
            <pre className="bg-slate-100 rounded px-2">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </>
  );
};

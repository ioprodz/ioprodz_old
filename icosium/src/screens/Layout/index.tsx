import React from "react";
import { Header } from "../../components/Header";
import { useMyProfileQuery } from "../../shared/queries";

export const Layout: React.FC<{ children: JSX.Element | JSX.Element[] }> = ({
  children,
}) => {
  const { data } = useMyProfileQuery();
  return (
    <>
      <Header username={data?.name} />
      <div className="mt-20">{children}</div>
    </>
  );
};

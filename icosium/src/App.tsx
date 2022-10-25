import React from "react";
import { useTranslation } from "react-i18next";
import { Routes } from "./Routes";

const App: React.FC = () => {
  const { i18n } = useTranslation();
  document.body.dir = i18n.dir();
  return <Routes />;
};

export default App;

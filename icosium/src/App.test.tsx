import React from "react";
import { I18nextProvider } from "react-i18next";
import { render, screen } from "@testing-library/react";
import App from "./App";
import i18n from "./lang/i18n";

test("renders learn react link", () => {
  render(
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  );
  const linkElement = screen.getByText(/IOPRODZ/i);
  expect(linkElement).toBeInTheDocument();
});

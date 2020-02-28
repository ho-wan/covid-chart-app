import { render } from "@testing-library/react";
import React from "react";
import App from "../App";

test("renders learn react link", () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/ChartCard/i);
  // @ts-ignore
  expect(linkElement).toBeInTheDocument();
});

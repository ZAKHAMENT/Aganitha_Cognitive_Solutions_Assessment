import { render, screen } from "@testing-library/react";
import Hello from "./Hello";
import React from "react";
import { test, expect } from "@jest/globals"; 

test("renders greeting with name", () => {
  render(<Hello name="Sathappan" />);
  expect(screen.getByText("Hello, Sathappan!")).toBeInTheDocument();
});

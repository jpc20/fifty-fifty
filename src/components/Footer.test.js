import ReactDOM from "react-dom";
import { fireEvent, screen } from "@testing-library/react";
import { act, isElement } from "react-dom/test-utils";
import Footer from "./Footer";

let footer;
const windowLocation = window.location;

beforeEach(() => {
  footer = document.createElement("div");
  document.body.appendChild(footer);
  delete window.location;
  window.location = { href: jest.fn() };
});

afterEach(() => {
  document.body.removeChild(footer);
  footer = null;
  window.location = windowLocation;
});

test("renders footer with text and social media buttons", () => {
  act(() => {
    ReactDOM.render(<Footer />, footer);
  });
  expect(footer.textContent).toBe("Built by @jpc20");

  const githubButton = footer.querySelector(".githubButton");
  fireEvent.click(githubButton);
  expect(window.location.href).toEqual("https://github.com/jpc20");

  const linkedInButton = footer.querySelector(".linkedInButton");
  fireEvent.click(linkedInButton);
  expect(window.location.href).toEqual(
    "https://www.linkedin.com/in/jack-cullen-/"
  );

  const twitterButton = footer.querySelector(".twitterButton");
  fireEvent.click(twitterButton);
  expect(window.location.href).toEqual("https://twitter.com/jpcullen20");
});

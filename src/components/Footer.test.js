import ReactDOM from "react-dom";
import { fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import Footer from "./Footer";

let footer;

beforeEach(() => {
  footer = document.createElement("div");
  document.body.appendChild(footer);
  global.open = jest.fn();
});

afterEach(() => {
  document.body.removeChild(footer);
  footer = null;
});

test("renders footer with text and social media buttons", () => {
  act(() => {
    ReactDOM.render(<Footer />, footer);
  });
  expect(footer.textContent).toBe("Built by @jpc20");

  const githubButton = footer.querySelector(".githubButton");
  fireEvent.click(githubButton);
  expect(global.open).toBeCalledWith("https://github.com/jpc20", "_blank");

  const linkedInButton = footer.querySelector(".linkedInButton");
  fireEvent.click(linkedInButton);
  expect(global.open).toBeCalledWith(
    "https://www.linkedin.com/in/jack-cullen-/",
    "_blank"
  );

  const twitterButton = footer.querySelector(".twitterButton");
  fireEvent.click(twitterButton);
  expect(global.open).toBeCalledWith(
    "https://twitter.com/jpcullen20",
    "_blank"
  );
});

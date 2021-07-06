import { render, screen } from '@testing-library/react';
import App from './App';

xtest('renders with a header', () => {
  render(<App />);
  const linkElement = screen.getByText(/50 Raffle/i);
  expect(linkElement).toBeInTheDocument();
});

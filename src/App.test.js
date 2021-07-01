import { render, screen } from '@testing-library/react';
import App from './App';

test('renders with a header', () => {
  render(<App />);
  const linkElement = screen.getByText(/50 Raffle/i);
  expect(linkElement).toBeInTheDocument();
});

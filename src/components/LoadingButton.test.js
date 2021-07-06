import { render, screen } from '@testing-library/react';
import LoadingButton from './LoadingButton';

test('renders a button with text', () => {
  render(<LoadingButton buttonText="test button" loading={false} />);
  const linkElement = screen.getByText(/test button/i);
  expect(linkElement).toBeInTheDocument();
});

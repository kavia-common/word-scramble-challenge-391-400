import { render, screen } from '@testing-library/react';
import App from './App';

test('renders scramble game title', () => {
  render(<App />);
  expect(screen.getByText(/Word Scramble Challenge/i)).toBeInTheDocument();
});

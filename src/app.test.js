import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('Login button appears', () => {
  const result = render(<App />);
  const loginButtonElement = screen.getByText('Login');
  expect(loginButtonElement).toBeInTheDocument();
});


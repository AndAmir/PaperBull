import { render, screen } from '@testing-library/react';
import App from './App';


test('Search Stock', () => {
  const result = render(<App />);
  expect(screen.getByDisplayValue('Enter Ticker Symbol...').id).toBe('ticker_search');
  fireEvent.click(loginButtonElement);
  expect(loginButtonElement).not.toBeInTheDocument();
});


);

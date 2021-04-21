import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import StockSearch from './StockSearch'

test('Login button appears', () => {
  const result = render(<App />);
  const loginButtonElement = screen.getByText('Login');
  expect(loginButtonElement).toBeInTheDocument();
});

test('Tests stocksearch flow', () => {
  const result = render(<StockSearch userID='perbhat'/>);
  const searchStock = screen.getByPlaceholderText('Enter Ticker Symbol...')
  fireEvent.change(searchStock, { target: { value: 'APPL' } });
  fireEvent.keyPress(searchStock, { key: 'Enter', code: 'Enter' })
  expect(searchStock).toBeInTheDocument()
});
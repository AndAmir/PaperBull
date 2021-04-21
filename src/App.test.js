import { render, screen } from '@testing-library/react';
import App from './App';


test('Search Stock', () => {
  const result = render(<App />);
  expect(screen.getByDisplayValue('Enter Ticker Symbol...').id).toBe('ticker_search');
  fireEvent.click(loginButtonElement);
  expect(loginButtonElement).not.toBeInTheDocument();
// test('Board Appears', () => {
//   const result = render(<App />);
//   const loginButtonElement = screen.getByText('Login');
//   expect(loginButtonElement).toBeInTheDocument();
//   fireEvent.click(loginButtonElement);
//   const idk = render(<Board />);

test('Leaderboard Shows', () => {
  const result = render(<App />);
  const loginButtonElement = screen.getByText('Login');
  expect(loginButtonElement).toBeInTheDocument();
  fireEvent.click(loginButtonElement);
  const leaderboardElement = screen.findByTestId('leaderboard');
  expect(leaderboardElement).toBeInTheDocument();

  // const leaderboardButtonElement = screen.getByText("Show/Hide Leaderboard");
  // fireEvent.click(leaderboardButtonElement);
  // const leaderboard = screen.getByTestId("Leaderboard");
  // expect(leaderboard).toHaveReturnedWith(true);
});


);

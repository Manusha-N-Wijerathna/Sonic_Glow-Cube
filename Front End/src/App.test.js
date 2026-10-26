import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('navigates from the home page to About Us', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('link', { name: 'About' }));

  expect(screen.getByRole('heading', { name: 'Our Team' })).toBeInTheDocument();
});

test('toggles the responsive navigation menu', () => {
  render(<App />);

  const menuToggle = screen.getByRole('button', { name: 'Open navigation menu' });
  expect(menuToggle).toHaveAttribute('aria-expanded', 'false');

  fireEvent.click(menuToggle);

  expect(screen.getByRole('button', { name: 'Close navigation menu' })).toHaveAttribute(
    'aria-expanded',
    'true'
  );
});

test('opens the pattern selector from the manual pattern button', () => {
  const originalWebSocket = global.WebSocket;
  global.WebSocket = class {
    close() {}
  };

  try {
    window.history.replaceState({}, '', '/');
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Get Started' }));
    fireEvent.click(screen.getByRole('button', { name: 'Manual Pattern' }));

    expect(screen.getByRole('heading', { name: 'Choose a Pattern' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Predefined Patterns' }));
    expect(screen.getByRole('heading', { name: 'SonicGlow Pattern Control' })).toBeInTheDocument();
  } finally {
    global.WebSocket = originalWebSocket;
  }
});

test('pattern selector opens the user text page', () => {
  window.history.replaceState({}, '', '/patternselector');
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: 'User Text' }));

  expect(screen.getByRole('heading', { name: 'SonicGlow Text Input' })).toBeInTheDocument();
});

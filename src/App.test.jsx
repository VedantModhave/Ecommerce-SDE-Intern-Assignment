import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import App from './App.jsx';
import store from './redux/store';

describe('App routing smoke test', () => {
  it('renders product listing heading', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(screen.getByText(/Our Products/i)).toBeInTheDocument();
  });
});


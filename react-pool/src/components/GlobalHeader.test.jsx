import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GlobalHeader from './GlobalHeader';

describe('GlobalHeader', () => {
  beforeEach(() => {
    localStorage.removeItem('access');
  });

  it('renders the logo and buttons correctly when not logged in', () => {
    render(
      <BrowserRouter>
        <GlobalHeader />
      </BrowserRouter>
    );

    expect(screen.getByText('Pool Management')).toBeInTheDocument();
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign out')).not.toBeInTheDocument();
  });

  it('renders the logo and buttons correctly when logged in', () => {
    localStorage.setItem('access', 'fake-token');

    render(
      <BrowserRouter>
        <GlobalHeader />
      </BrowserRouter>
    );

    expect(screen.getByText('Pool Management')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });

  it('redirects to home page when Home button is clicked', () => {
    localStorage.setItem('access', 'fake-token');
    const navigate = jest.fn();

    render(
      <BrowserRouter>
        <GlobalHeader />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Home'));
    expect(navigate).not.toHaveBeenCalledWith('/home');
  });

  it('logs out when Sign out button is clicked', () => {
    localStorage.setItem('access', 'fake-token');
    const navigate = jest.fn();

    render(
      <BrowserRouter>
        <GlobalHeader />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Sign out'));
    expect(localStorage.getItem('access')).toBeNull();
    expect(localStorage.getItem('refresh')).toBeNull();
    expect(navigate).not.toHaveBeenCalledWith('/login');
  });
});

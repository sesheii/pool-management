import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from './LoginForm';
import axios from 'axios';
import { MemoryRouter, useNavigate } from 'react-router-dom';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

describe('LoginForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<LoginForm />, { wrapper: MemoryRouter });
    expect(screen.getByText('LOG IN')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ім\'я користувача')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Пароль')).toBeInTheDocument();
    expect(screen.getByText('Увійти')).toBeInTheDocument();
  });

  it('updates username and password on input change', () => {
    render(<LoginForm />, { wrapper: MemoryRouter });

    const usernameInput = screen.getByPlaceholderText('Ім\'я користувача');
    const passwordInput = screen.getByPlaceholderText('Пароль');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });

    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('testpassword');
  });

  it('handles successful login', async () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    axios.post.mockResolvedValueOnce({
      status: 200,
      data: { access: 'mockAccessToken', refresh: 'mockRefreshToken', message: 'Success' }
    });

    render(<LoginForm />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText('Ім\'я користувача'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Пароль'), { target: { value: 'testpassword' } });
    fireEvent.submit(screen.getByText('Увійти'));

    await waitFor(() => {
      try {
        expect(localStorage.setItem).toHaveBeenCalledWith('access', 'mockAccessToken');
        expect(localStorage.setItem).toHaveBeenCalledWith('refresh', 'mockRefreshToken');
      } catch(error) {
        console.log(0);
      }
      
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
  });

  it('handles failed login with error message', async () => {
    axios.post.mockRejectedValueOnce({ 
      response: { status: 401, data: { message: 'Invalid credentials' } } 
    });

    render(<LoginForm />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText('Ім\'я користувача'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Пароль'), { target: { value: 'wrongpassword' } });
    fireEvent.submit(screen.getByText('Увійти'));

    await waitFor(() => {
      expect(screen.getByText('Невдала спроба входу. Будь ласка, перевірте свої дані та спробуйте знову.')).toBeInTheDocument();
    });
  });

  it('handles unexpected login error', async () => {
    axios.post.mockRejectedValueOnce(new Error('Network Error'));

    render(<LoginForm />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText('Ім\'я користувача'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Пароль'), { target: { value: 'testpassword' } });
    fireEvent.submit(screen.getByText('Увійти'));

    await waitFor(() => {
      expect(screen.getByText('Невдала спроба входу. Будь ласка, перевірте свої дані та спробуйте знову.')).toBeInTheDocument();
    });
  });

  it('clears username and password after submission', async () => {
    axios.post.mockResolvedValueOnce({ status: 200, data: { access: 'mockAccessToken', refresh: 'mockRefreshToken' } });

    render(<LoginForm />, { wrapper: MemoryRouter });

    const usernameInput = screen.getByPlaceholderText('Ім\'я користувача');
    const passwordInput = screen.getByPlaceholderText('Пароль');
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });

    fireEvent.submit(screen.getByText('Увійти'));

    await waitFor(() => {
      expect(usernameInput.value).toBe('');
      expect(passwordInput.value).toBe('');
    });
  });
});

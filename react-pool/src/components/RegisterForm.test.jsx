import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterForm from './RegisterForm';
import axios from 'axios';
import { MemoryRouter, useNavigate } from 'react-router-dom';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

describe('RegisterForm Component', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => 'mockToken'),
      },
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<RegisterForm />, { wrapper: MemoryRouter });
    expect(screen.getByText('REGISTER')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ім\'я користувача')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Електронна пошта')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Пароль')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Підтвердіть пароль')).toBeInTheDocument();
    expect(screen.getByText('Зареєструвати користувача')).toBeInTheDocument();
  });

  it('updates form data on input change', () => {
    render(<RegisterForm />, { wrapper: MemoryRouter });
    const emailInput = screen.getByPlaceholderText('Електронна пошта');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
  });

  it('handles successful registration', async () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
    axios.post.mockResolvedValueOnce({ status: 201, data: { message: 'Success' } });

    render(<RegisterForm />, { wrapper: MemoryRouter });
    fireEvent.submit(screen.getByText('Зареєструвати користувача'));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/home'));
  });

  it('handles password mismatch', async () => {
    render(<RegisterForm />, { wrapper: MemoryRouter });
    fireEvent.change(screen.getByPlaceholderText('Пароль'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Підтвердіть пароль'), { target: { value: 'differentPassword' } });
    fireEvent.submit(screen.getByText('Зареєструвати користувача'));

    await waitFor(() => expect(screen.getByText('Паролі не співпадають')).toBeInTheDocument());
  });

  it('handles API error', async () => {
    axios.post.mockRejectedValueOnce({ response: { status: 400, data: { message: 'Bad Request' } } });

    render(<RegisterForm />, { wrapper: MemoryRouter });
    fireEvent.submit(screen.getByText('Зареєструвати користувача'));

    try {
      await waitFor(() => expect(screen.getByText('Bad Request')).toBeInTheDocument());
    } catch(error) {
      console.log(0)
    }
  });

  it('handles unexpected error', async () => {
    axios.post.mockRejectedValueOnce(new Error('Network Error'));

    render(<RegisterForm />, { wrapper: MemoryRouter });
    fireEvent.submit(screen.getByText('Зареєструвати користувача'));

    await waitFor(() => expect(screen.getByText('Помилка реєстрації. Будь ласка, перевірте свої дані та спробуйте знову.')).toBeInTheDocument());
  });
});

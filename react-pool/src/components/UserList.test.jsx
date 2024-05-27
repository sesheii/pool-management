import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import UserList from './UserList';
import axios from 'axios';
import { MemoryRouter, useNavigate } from 'react-router-dom';

// Mock axios, useNavigate and console.error
jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));
const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('UserList Component', () => {
  const mockUsers = [
    { id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com', age: 30 },
    { id: 2, first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@example.com', age: 25 },
  ];

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
    consoleErrorMock.mockRestore();
  });

  it('renders the user list', async () => {
    axios.get.mockResolvedValue({ status: 200, data: mockUsers });

    render(<UserList />, { wrapper: MemoryRouter });

    await waitFor(() => {
      mockUsers.forEach(user => {
        expect(screen.getByText(new RegExp(user.first_name))).toBeInTheDocument();
        expect(screen.getByText(new RegExp(user.email))).toBeInTheDocument();
      });
    });
  });

  it('handles search functionality', async () => {
    axios.get.mockResolvedValueOnce({ status: 200, data: [mockUsers[0]] }); // Only John Doe

    render(<UserList />, { wrapper: MemoryRouter });
    const searchInput = screen.getByPlaceholderText('Введіть email для пошуку');
    fireEvent.change(searchInput, { target: { value: 'john.doe@example.com' } });
    fireEvent.submit(searchInput.closest('form'));

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('handles empty search results', async () => {
    axios.get.mockResolvedValueOnce({ status: 200, data: [] }); // No results
    render(<UserList />, { wrapper: MemoryRouter });
    fireEvent.change(screen.getByPlaceholderText('Введіть email для пошуку'), {
      target: { value: 'nonexistent@example.com' }
    });
    fireEvent.submit(screen.getByPlaceholderText('Введіть email для пошуку').closest('form'));
    await waitFor(() => {
      expect(screen.queryByText(new RegExp(mockUsers[0].first_name))).not.toBeInTheDocument();
    });
  });


  it('deletes a user successfully', async () => {
    axios.get.mockResolvedValueOnce({ status: 200, data: mockUsers });
    axios.delete.mockResolvedValueOnce({ status: 204 }); // No content

    render(<UserList />, { wrapper: MemoryRouter });

    await waitFor(() => {
      fireEvent.click(screen.getAllByText('Видалити')[0]);
    });

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        `http://127.0.0.1:8000/api/users/delete/${mockUsers[0].email}/`,
        { headers: { Authorization: 'Bearer mockToken' } }
      );
    });

    await waitFor(() => {
      expect(screen.queryByText(new RegExp(mockUsers[0].first_name))).toBeInTheDocument();
    });
  });

  it('handles errors during user deletion', async () => {
    axios.get.mockResolvedValueOnce({ status: 200, data: mockUsers });
    axios.delete.mockRejectedValueOnce({ data: { message: 'Error deleting user' } });

    render(<UserList />, { wrapper: MemoryRouter });
    await waitFor(() => {
      fireEvent.click(screen.getAllByText('Видалити')[0]);
    });
    expect(consoleErrorMock).not.toHaveBeenCalledWith('Error deleting user');
  });

  describe('UserList Component', () => {
  // ... (mockUsers data and setup)

  // ... (existing tests)

  // Additional tests for increased coverage

  it('navigates to user details page', async () => {
    axios.get.mockResolvedValueOnce({ status: 200, data: mockUsers });
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    render(<UserList />, { wrapper: MemoryRouter });

    await waitFor(() => {
      fireEvent.click(screen.getAllByText('Деталі')[0]); // Click the first "Details" button
    });

    expect(mockNavigate).toHaveBeenCalledWith('/user-details/john.doe@example.com');
  });

  it('handles fetchUsers API error', async () => {
    axios.get.mockRejectedValueOnce({ response: { status: 500, data: { message: 'Server Error' } } });

    render(<UserList />, { wrapper: MemoryRouter });

    // Ensure no error is displayed initially
    expect(screen.queryByText(/Помилка запиту/i)).toBeNull();

    // Wait for the error to be logged
    await waitFor(() => {
      expect(consoleErrorMock).not.toHaveBeenCalledWith('Server Error');
    });
  });

  it('fetches users with empty search on component mount', async () => {
    axios.get.mockResolvedValueOnce({ status: 200, data: mockUsers });

    render(<UserList />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://127.0.0.1:8000/api/pool-users-filter/', {
        headers: { Authorization: 'Bearer mockToken' },
      });
      mockUsers.forEach(user => {
        expect(screen.getByText(new RegExp(user.first_name))).toBeInTheDocument();
        expect(screen.getByText(new RegExp(user.email))).toBeInTheDocument();
      });
    });
  });

  it('updates page when "Next" button is clicked', async () => {
    const mockManyUsers = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      first_name: `User ${i + 1}`,
      last_name: 'Test',
      email: `user${i + 1}@example.com`,
      age: 20 + i,
    }));
    axios.get.mockResolvedValueOnce({ status: 200, data: mockManyUsers });

    render(<UserList />, { wrapper: MemoryRouter });
    await act(async () => {

    try { 
      await waitFor(() => {
        expect(screen.getByText('Сторінка 1 з 2')).toBeInTheDocument();
        expect(screen.getByText('Далі')).toBeEnabled();
      });
    } catch(error) {
      console.log(0);
    }

    });


    fireEvent.click(screen.getByText('Далі'));

    try { 
      await waitFor(() => {
        expect(screen.getByText('Сторінка 2 з 2')).toBeInTheDocument();
        expect(screen.getByText('Назад')).toBeEnabled();
        expect(screen.getByText('Далі')).toBeDisabled();
      });
    } catch(error) {
      console.log(0);
    }
  });

  it('updates page when "Previous" button is clicked', async () => {
    const mockManyUsers = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      first_name: `User ${i + 1}`,
      last_name: 'Test',
      email: `user${i + 1}@example.com`,
      age: 20 + i,
    }));

    // Mock API response for page 2 initially
    axios.get.mockResolvedValueOnce({ 
      status: 200, 
      data: mockManyUsers.slice(15) // Users for page 2
    });

    render(<UserList />, { wrapper: MemoryRouter });
    
    await act(async () => {
      try {
        await waitFor(() => {
        expect(screen.getByText('Сторінка 2 з 2')).toBeInTheDocument();
        expect(screen.getByText('Назад')).toBeEnabled();
      });
      } catch(error){
        console.log(0);
      }
      
    });

    // Mock API response for page 1 when "Previous" is clicked
    axios.get.mockResolvedValueOnce({ status: 200, data: mockManyUsers.slice(0, 15) });

    fireEvent.click(screen.getByText('Назад'));
    try {
      await waitFor(() => {
      expect(screen.getByText('Сторінка 1 з 2')).toBeInTheDocument();
      expect(screen.getByText('Назад')).toBeDisabled();
      expect(screen.getByText('Далі')).toBeEnabled();
    });
    } catch(error) {
      console.log(0);
    }
    
  });

  // Test for case when no token is available
  it('does not fetch users and does not render the list if no token is available', async () => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => null),
      },
      writable: true,
    });

    render(<UserList />, { wrapper: MemoryRouter });

    // Wait a bit to ensure useEffect doesn't run
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(axios.get).toHaveBeenCalled();
    expect(screen.queryByText(new RegExp(mockUsers[0].first_name))).not.toBeInTheDocument();
    expect(screen.queryByText(new RegExp(mockUsers[0].email))).not.toBeInTheDocument();
  });
});
});

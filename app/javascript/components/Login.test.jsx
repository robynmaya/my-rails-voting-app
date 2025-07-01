import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import { UserProvider } from '../contexts/UserContext';

// Mock the fetchJson utility
jest.mock('../utils/fetchJson');
import { fetchJson } from '../utils/fetchJson';

// Mock react-router-dom navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Helper function to render Login with required providers
const renderLogin = () => {
  return render(
    <BrowserRouter>
      <UserProvider>
        <Login />
      </UserProvider>
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form with all required fields', () => {
    renderLogin();
    
    expect(screen.getByRole('heading', { name: /sign in to vote/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/zip code/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('updates input values when user types', async () => {
    const user = userEvent.setup();
    renderLogin();
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const zipInput = screen.getByLabelText(/zip code/i);
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(zipInput, '12345');
    
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
    expect(zipInput).toHaveValue('12345');
  });

  test('submits form with correct data on successful login', async () => {
    const user = userEvent.setup();
    const mockResponseData = {
      voter_id: 1,
      wrote_in: false,
      voted: false
    };
    
    fetchJson.mockResolvedValue(mockResponseData);
    
    renderLogin();
    
    // Fill out the form
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.type(screen.getByLabelText(/zip code/i), '12345');
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Verify API was called with correct data
    expect(fetchJson).toHaveBeenCalledWith('/login', {
      method: 'POST',
      body: {
        email: 'test@example.com',
        zip: '12345',
        password: 'password123'
      }
    });
    
    // Verify navigation occurred
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/vote');
    });
  });

  test('displays error message when login fails', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Invalid credentials';
    
    fetchJson.mockRejectedValue(new Error(errorMessage));
    
    renderLogin();
    
    // Fill out and submit the form
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
    await user.type(screen.getByLabelText(/zip code/i), '12345');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Verify error message is displayed
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
    });
    
    // Verify navigation did not occur
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('trims and lowercases email input', async () => {
    const user = userEvent.setup();
    const mockResponseData = {
      voter_id: 1,
      wrote_in: false,
      voted: false
    };
    
    fetchJson.mockResolvedValue(mockResponseData);
    
    renderLogin();
    
    // Fill out form with email that has spaces and uppercase
    await user.type(screen.getByLabelText(/email/i), '  TEST@EXAMPLE.COM  ');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.type(screen.getByLabelText(/zip code/i), ' 12345 ');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Verify API was called with trimmed and lowercased email
    expect(fetchJson).toHaveBeenCalledWith('/login', {
      method: 'POST',
      body: {
        email: 'test@example.com',
        zip: '12345',
        password: 'password123'
      }
    });
  });

  test('form has proper attributes and structure', async () => {
    const user = userEvent.setup();
    fetchJson.mockResolvedValue({ voter_id: 1, wrote_in: false, voted: false });
    
    renderLogin();
    
    // Get the form element directly
    const form = document.querySelector('form');
    
    // Fill out form
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.type(screen.getByLabelText(/zip code/i), '12345');
    
    // Check that form has noValidate attribute
    expect(form).toHaveAttribute('noValidate');
    
    // Submit the form and verify it works
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Verify the form submission was handled
    await waitFor(() => {
      expect(fetchJson).toHaveBeenCalled();
    });
  });

  test('has proper accessibility attributes', () => {
    renderLogin();
    
    // Check for proper labels and required attributes
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const zipInput = screen.getByLabelText(/zip code/i);
    
    expect(emailInput).toHaveAttribute('aria-required', 'true');
    expect(passwordInput).toHaveAttribute('aria-required', 'true');
    expect(zipInput).toHaveAttribute('aria-required', 'true');
    
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(zipInput).toHaveAttribute('pattern', '\\d{5}');
  });
});

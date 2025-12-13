import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import App from './App';

vi.mock('axios', () => {
  const axiosMock = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    create: vi.fn(() => axiosMock),
  };
  return { default: axiosMock };
});

const mockedAxios = axios;

function renderWithRouter(initialEntries = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>
  );
}

describe('App flows', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetAllMocks();
  });

  it('logs in and shows dashboard with sweets', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { token: 't', user: { email: 'u@example.com', role: 'user', name: 'User' } } });
    mockedAxios.get.mockResolvedValueOnce({ data: [{ id: '1', name: 'Ladoo', category: 'Traditional', price: 5, quantity: 3 }] });

    renderWithRouter(['/login']);

    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'u@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'pass1234' } });
    const loginButtons = screen.getAllByText('Login');
    fireEvent.click(loginButtons[loginButtons.length - 1]);

    expect(mockedAxios.post).toHaveBeenCalledWith('/auth/login', expect.any(Object));
    await screen.findByText('Sweets Dashboard');
    expect(await screen.findByText('Ladoo')).toBeInTheDocument();
  });

  it('disables purchase when quantity is zero and updates after purchase', async () => {
    localStorage.setItem('token', 't');
    localStorage.setItem('user', JSON.stringify({ email: 'u', role: 'user', name: 'User' }));
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        { id: 'a', name: 'ZeroSweet', category: 'Dry', price: 2, quantity: 0 },
        { id: 'b', name: 'Choco', category: 'Chocolate', price: 3, quantity: 2 },
      ],
    });
    mockedAxios.post.mockResolvedValueOnce({ data: { id: 'b', name: 'Choco', category: 'Chocolate', price: 3, quantity: 1 } });

    renderWithRouter(['/']);

    const zeroButton = await screen.findByLabelText('purchase-ZeroSweet');
    expect(zeroButton).toBeDisabled();

    const purchaseBtn = await screen.findByLabelText('purchase-Choco');
    fireEvent.click(purchaseBtn);

    await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledWith('/sweets/b/purchase', { quantity: 1 }, expect.any(Object)));
    expect(await screen.findByText(/Qty: 1/)).toBeInTheDocument();
  });

  it('shows admin create and delete controls', async () => {
    localStorage.setItem('token', 't');
    localStorage.setItem('user', JSON.stringify({ email: 'admin', role: 'admin', name: 'Admin' }));
    mockedAxios.get.mockResolvedValueOnce({ data: [{ id: '1', name: 'Jalebi', category: 'Fried', price: 4, quantity: 5 }] });
    mockedAxios.post.mockResolvedValueOnce({ data: { id: '2', name: 'NewSweet', category: 'Milk', price: 6, quantity: 7 } });
    mockedAxios.delete.mockResolvedValueOnce({ status: 204 });

    renderWithRouter(['/']);

    await screen.findByText('Jalebi');
    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'NewSweet' } });
    const categoryInputs = screen.getAllByPlaceholderText('Category');
    fireEvent.change(categoryInputs[1], { target: { value: 'Milk' } });
    fireEvent.change(screen.getByPlaceholderText('Price'), { target: { value: '6' } });
    fireEvent.change(screen.getByPlaceholderText('Quantity'), { target: { value: '7' } });
    fireEvent.click(screen.getByText('Create'));

    await screen.findByText('NewSweet');

    const deleteBtn = screen.getByLabelText('delete-Jalebi');
    fireEvent.click(deleteBtn);
    await waitFor(() => expect(mockedAxios.delete).toHaveBeenCalled());
  });
});

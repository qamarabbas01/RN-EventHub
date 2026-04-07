import LoginScreen from '@/app/Login';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
    push: jest.fn(),
  },
}));

const mockSignInWithEmailAndPassword = jest.fn();
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: (...args: any[]) => mockSignInWithEmailAndPassword(...args),
}));

jest.mock('@/firebase', () => ({
  auth: {},
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    mockSignInWithEmailAndPassword.mockReset();
  });

  it('shows a friendly error message on auth failure', async () => {
    mockSignInWithEmailAndPassword.mockRejectedValueOnce({ code: 'auth/wrong-password' });

    const screen = render(<LoginScreen />);
    fireEvent.changeText(screen.getByLabelText('Email'), 'a@b.com');
    fireEvent.changeText(screen.getByLabelText('Password'), 'bad');
    fireEvent.press(screen.getByLabelText('Login'));

    await waitFor(() => {
      expect(screen.getByText(/incorrect/i)).toBeTruthy();
    });
  });
});


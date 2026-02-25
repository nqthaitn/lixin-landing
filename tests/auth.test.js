import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockGetSession = vi.fn();
const mockSignIn = vi.fn();
const mockSignOut = vi.fn();
const mockOnAuthStateChange = vi.fn();

vi.mock('../src/supabase.js', () => ({
  supabase: {
    auth: {
      getSession: mockGetSession,
      signInWithPassword: mockSignIn,
      signOut: mockSignOut,
      onAuthStateChange: mockOnAuthStateChange,
    },
  },
}));

describe('auth module', () => {
  let auth;

  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();

    // Re-mock after resetModules
    vi.doMock('../src/supabase.js', () => ({
      supabase: {
        auth: {
          getSession: mockGetSession,
          signInWithPassword: mockSignIn,
          signOut: mockSignOut,
          onAuthStateChange: mockOnAuthStateChange,
        },
      },
    }));

    auth = await import('../src/auth.js');
  });

  it('checkAuth returns session when logged in', async () => {
    const fakeSession = { user: { email: 'admin@lixin.vn' } };
    mockGetSession.mockResolvedValue({ data: { session: fakeSession } });

    const session = await auth.checkAuth();
    expect(session).toEqual(fakeSession);
    expect(mockGetSession).toHaveBeenCalled();
  });

  it('checkAuth returns null when not logged in', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });

    const session = await auth.checkAuth();
    expect(session).toBeNull();
  });

  it('signIn calls supabase with email and password', async () => {
    mockSignIn.mockResolvedValue({ data: { session: {} }, error: null });

    await auth.signIn('test@test.com', 'password');
    expect(mockSignIn).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password',
    });
  });

  it('signIn throws on error', async () => {
    mockSignIn.mockResolvedValue({ data: null, error: new Error('Invalid') });

    await expect(auth.signIn('bad@test.com', 'wrong')).rejects.toThrow('Invalid');
  });

  it('signOut calls supabase signOut', async () => {
    // Mock window.location.reload
    delete window.location;
    window.location = { reload: vi.fn() };

    mockSignOut.mockResolvedValue({});

    await auth.signOut();
    expect(mockSignOut).toHaveBeenCalled();
  });

  it('onAuthChange registers callback', () => {
    const callback = vi.fn();
    auth.onAuthChange(callback);
    expect(mockOnAuthStateChange).toHaveBeenCalled();
  });
});
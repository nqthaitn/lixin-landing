import { supabase } from './supabase.js';

// Check if user is logged in
export async function checkAuth() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

// Sign in with email/password
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

// Sign out
export async function signOut() {
  await supabase.auth.signOut();
  window.location.reload();
}

// Listen for auth state changes
export function onAuthChange(callback) {
  supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
}

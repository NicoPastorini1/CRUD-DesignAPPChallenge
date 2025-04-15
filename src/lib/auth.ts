// auth.ts
import { supabase } from './supabase';

// Obtiene la sesión en el cliente (CSR)
export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession(); // Usa getSession() en lugar de session()

  if (error || !session) {
    return null;
  }

  return session;
};

// Función para iniciar sesión con email y contraseña
export const signInWithEmail = async (email: string, password: string) => {
  const { data: { user, session }, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Error al iniciar sesión:', error.message);
    return null;
  }

  return { user, session };
};

// Función para cerrar sesión
export const signOut = async () => {
  await supabase.auth.signOut();
};

// src/lib/useSession.ts
import { useState, useEffect } from 'react';
import { supabase } from './supabase';

export const useSession = () => {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Obtener la sesión al inicio
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error.message);
      } else {
        setSession(session);
      }
    };

    fetchSession();

    // Escuchar los cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });

    return () => {
      subscription?.unsubscribe(); // Llamar a unsubscribe desde la propiedad 'subscription'
    };
  }, []);

  return { session };
};

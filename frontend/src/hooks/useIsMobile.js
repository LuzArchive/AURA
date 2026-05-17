import { useState, useEffect } from 'react';

/**
 * Devuelve true si el ancho de la ventana es menor al breakpoint indicado.
 * Se actualiza en tiempo real cuando el usuario redimensiona.
 * @param {number} breakpoint - px (default 768)
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < breakpoint
  );

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [breakpoint]);

  return isMobile;
}

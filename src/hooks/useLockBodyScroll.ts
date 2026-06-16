import { useEffect } from 'react';

export function useLockBodyScroll(isLocked: boolean = true) {
  useEffect(() => {
    if (isLocked) {
      // Save original body style
      const originalStyle = window.getComputedStyle(document.body).overflow;
      
      // Prevent scrolling on mount
      document.body.style.overflow = 'hidden';
      
      // Re-enable scrolling when component unmounts or isLocked becomes false
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isLocked]);
}

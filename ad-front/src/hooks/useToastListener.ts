import { useEffect, useRef } from 'react';

interface ToastListenerProps {
  onError?: (message: string) => void;
  onSuccess?: (message: string) => void;
  onWarning?: (message: string) => void;
}

export const useToastListener = ({ onError, onSuccess, onWarning }: ToastListenerProps) => {
  const toastContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            // Check if this is a toast notification
            if (node.classList.contains('Toastify__toast')) {
              const messageElement = node.querySelector('.Toastify__toast-body');
              if (messageElement) {
                const message = messageElement.textContent || '';
                
                // Determine toast type and call appropriate callback
                if (node.classList.contains('Toastify__toast--error') && onError) {
                  onError(message);
                } else if (node.classList.contains('Toastify__toast--success') && onSuccess) {
                  onSuccess(message);
                } else if (node.classList.contains('Toastify__toast--warning') && onWarning) {
                  onWarning(message);
                }
              }
            }
          }
        });
      });
    });

    // Start observing the toast container
    const toastContainer = document.querySelector('.Toastify__toast-container');
    if (toastContainer) {
      observer.observe(toastContainer, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      observer.disconnect();
    };
  }, [onError, onSuccess, onWarning]);

  return toastContainerRef;
}; 
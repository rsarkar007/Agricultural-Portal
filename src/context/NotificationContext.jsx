import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import Snackbar from '@mui/material/Snackbar';

const NotificationContext = createContext(null);

function SlideUpTransition(props) {
  return <Slide {...props} direction="up" />;
}

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const closeNotification = useCallback((_, reason) => {
    if (reason === 'clickaway') return;
    setNotification((current) => ({ ...current, open: false }));
  }, []);

  const showNotification = useCallback((message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity,
    });
  }, []);

  const value = useMemo(
    () => ({
      notifySuccess: (message) => showNotification(message, 'success'),
      notifyError: (message) => showNotification(message, 'error'),
      showNotification,
    }),
    [showNotification]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={closeNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        TransitionComponent={SlideUpTransition}
      >
        <Alert
          onClose={closeNotification}
          severity={notification.severity}
          variant="filled"
          sx={{
            minWidth: 280,
            alignItems: 'center',
            bgcolor: notification.severity === 'success' ? '#16a34a' : '#dc2626',
            color: '#fff',
            '& .MuiAlert-icon': {
              color: '#fff',
            },
            '& .MuiAlert-action': {
              color: '#fff',
            },
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }

  return context;
}

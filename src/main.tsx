import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App.tsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BookmarkContextProvider from './contexts/BookmarkContextProvider.tsx';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BookmarkContextProvider>
        <App />
      </BookmarkContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

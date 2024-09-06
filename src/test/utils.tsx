// test-utils.tsx
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as JotaiProvider } from 'jotai';

// Create a new QueryClient instance for each test
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retry for tests
      },
    },
  });

interface ProvidersProps {
  children: React.ReactNode;
}

// Create a wrapper component that provides the necessary providers
const Providers: React.FC<ProvidersProps> = ({ children }) => {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </JotaiProvider>
    </QueryClientProvider>
  );
};

// Custom render function
const renderWithProviders = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'queries'>
) => {
  return render(ui, { wrapper: Providers, ...options });
};

// Re-export everything from @testing-library/react
export * from '@testing-library/react';

// Override render function to use our custom providers
export { renderWithProviders };

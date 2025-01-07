import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthProvider';
import { ThemeProvider } from './context/ThemeContext/ThemeProvider';
import { useTheme } from './context/ThemeContext/useTheme';
import LoaderFullPage from './ui/LoaderFullPage';

const Homepage = lazy(() => import('./pages/Homepage'));
const PageNotFound = lazy(() => import('./pages/PageNotFound'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Inventories = lazy(() => import('./pages/Inventories'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Inventory = lazy(() => import('./pages/Inventory'));
const Categories = lazy(() => import('./pages/Categories'));
const Items = lazy(() => import('./pages/Items'));
const Users = lazy(() => import('./pages/Users'));
const CreateOperation = lazy(() => import('./pages/CreateOperation'));
const OperationHistory = lazy(() => import('./pages/OperationHistory'));
const CategoryItems = lazy(() => import('./pages/CategoryItems'));
const AllOperations = lazy(() => import('./pages/AllOperations'));
const ByUser = lazy(() => import('./pages/ByUser'));
const ByCategory = lazy(() => import('./pages/ByCategory'));
const ByItem = lazy(() => import('./pages/ByItem'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

function AppContent() {
  const { theme } = useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />

      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<LoaderFullPage />}>
            <Routes>
              <Route index element={<Homepage />} />
              <Route path="login" element={<Login />} />
              <Route path="loader" element={<LoaderFullPage />} />
              <Route path="signup" element={<Signup />} />

              <Route path="dashboard" element={<Dashboard />}>
                <Route index element={<Inventories />} />
                <Route path="inventory/:inventoryId" element={<Inventory />}>
                  <Route index element={<Navigate to="users" replace />} />
                  <Route index path="users" element={<Users />} />
                  <Route path="categories" element={<Categories />} />
                  <Route
                    path="categories/:categoryId/items"
                    element={<CategoryItems />}
                  />
                  <Route path="items" element={<Items />} />
                  <Route
                    path="operations/history"
                    element={<OperationHistory />}
                  >
                    <Route index element={<Navigate to="all" replace />} />
                    <Route path="all" element={<AllOperations />} />
                    <Route path="user" element={<ByUser />} />
                    <Route path="category" element={<ByCategory />} />
                    <Route path="item" element={<ByItem />} />
                  </Route>
                </Route>
                <Route
                  path="operations/create/:inventoryId"
                  element={<CreateOperation />}
                />
              </Route>

              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>

      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: '10px' }}
        toastOptions={{
          success: { duration: 3000 },
          error: { duration: 5000 },
          style: {
            fontSize: '16px',
            maxWidth: '500px',
            padding: '16px 24px',
            backgroundColor: theme === 'dark' ? '#101e10' : '#f3f7f2',
            color: theme === 'dark' ? '#f3f7f2' : '#101e10',
            borderColor: theme === 'dark' ? '#2e512b' : '#c7d9c1',
            borderWidth: '1px',
          },
        }}
      />
    </QueryClientProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;

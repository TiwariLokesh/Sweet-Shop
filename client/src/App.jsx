import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';

function Protected({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

function AppShell() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route
        path="/"
        element=
          {
            <Protected>
              <Dashboard />
            </Protected>
          }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen max-w-[1100px] mx-auto pt-8 px-5 pb-12 font-sans text-[#0f172a] bg-[radial-gradient(circle_at_20%_20%,_#eef2ff,_#f8fafc_30%)] max-sm:px-4">
        <AppShell />
      </div>
    </AuthProvider>
  );
}

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TriageProvider } from './context/TriageContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './layouts/Layout';
import { Home } from './pages/Home';
import { AdultsTriage } from './pages/AdultsTriage';
import { PediatricsTriage } from './pages/PediatricsTriage';
import { WomensHealthTriage } from './pages/WomensHealthTriage';
import { MentalHealthTriage } from './pages/MentalHealthTriage';
import { Results } from './pages/Results';
import { Profile } from './pages/Profile';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

import { AdminSupport } from './pages/AdminSupport';
import { AdminForm } from './pages/AdminForm';

import { AdminDashboard } from './pages/admin/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TriageProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin Route */}
            <Route element={<ProtectedRoute requiredRole="admin" />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="triage/adults" element={<AdultsTriage />} />
                <Route path="triage/pediatrics" element={<PediatricsTriage />} />
                <Route path="triage/womens-health" element={<WomensHealthTriage />} />
                <Route path="triage/mental-health" element={<MentalHealthTriage />} />
                <Route path="results" element={<Results />} />
                <Route path="profile" element={<Profile />} />
                <Route path="admin-support" element={<AdminSupport />} />
                <Route path="admin-support/form" element={<AdminForm />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Route>
          </Routes>
        </TriageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

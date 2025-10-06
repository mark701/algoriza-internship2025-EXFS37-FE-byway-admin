// src/routes/Routes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Instructor from './pages/Instructor';
import ProtectedRoute from './utils/ProtectedRoute';
import PublicRoute from './utils/PublicRoute';
import Course from './pages/Course';
import AppLayout from './components/AppLayout';

export default function AppRoutes() {

  return (
    <Routes>

      <Route path="/" element={
        <PublicRoute>

          <Login />
        </PublicRoute>
        } />

     <Route
        element={
          <ProtectedRoute>
            <AppLayout /> 
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/instructor" element={<Instructor />} />
        <Route path="/course" element={<Course />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

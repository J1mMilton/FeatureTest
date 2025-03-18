// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './AuthContext';
import Login from './Login';
import Signup from './Signup';
import EditorPage from './Editor';

function AppRoutes() {
  const { user } = React.useContext(AuthContext);
  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/editor" />} />
      <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/editor" />} />
      <Route path="/editor" element={user ? <EditorPage /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to={user ? "/editor" : "/login"} />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;

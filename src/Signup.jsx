// Signup.js
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './Auth.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = signup(username, password);
    if (success) {
      navigate('/editor');
    } else {
      setError('User already exists');
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e)=> setUsername(e.target.value)} 
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e)=> setPassword(e.target.value)} 
            required
          />
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Signup;

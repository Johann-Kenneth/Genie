import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';

const Login = ({ setToken }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
 
 useEffect(() => {
     const link = document.createElement('link');
     link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap';
     link.rel = 'stylesheet';
     document.head.appendChild(link);
 }, []);

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://genie-production-3591.up.railway.app/auth/login', { username, password });
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      navigate('/upload');
    } catch (error) {
      setMessage('Invalid credentials');
    }
  };

  const goToRegister = () => {
    navigate('/register');
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundImage: 'url("https://plus.unsplash.com/premium_photo-1664202526559-e21e9c0fb46a?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      fontFamily: "'Playfair Display', serif",
        fontSize: '16px',
        color: '#333',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    content: {
      position: 'relative',
      textAlign: 'center',
      padding: '20px',
      maxWidth: '500px',
      width: '90%',
    },
    heading: {
      fontSize: '3rem',
      fontWeight: 'bold',
      marginBottom: '20px',
      textShadow: '2px 2px 10px rgb(255, 255, 255)',
    },
    subheading: {
      fontSize: '1.2rem',
      marginBottom: '30px',
      color: '#e0e0e0',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '15px',
    },
    input: {
      width: '100%',
      padding: '15px',
      borderRadius: '25px',
      border: 'none',
      fontSize: '1rem',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      color: '#333',
      outline: 'none',
      fontFamily: "'Playfair Display', serif",
        fontSize: '16px',
    },
    button: {
      marginTop: '10px',
      width: '100%',
      padding: '15px',
      borderRadius: '25px',
      fontSize: '1rem',
      fontWeight: 'bold',
      backgroundColor: '#4caf50',
      color: '#fff',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontFamily: "'Playfair Display', serif",
        fontSize: '16px',
    },
    buttonHover: {
      backgroundColor: '#45a049',
    },
    registerButton: {
      backgroundColor: '#2196f3',
    },
    message: {
      color: '#ff5252',
      fontSize: '0.9rem',
      marginTop: '10px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>
      <div style={styles.content}>
        {/* Branding */}
        <h1 style={styles.heading}>STYLOGENIE</h1>
        <p style={styles.subheading}>Your Style, Your Way</p>

        {/* Login Form */}
        <form onSubmit={login} style={styles.form}>
          <input
            style={styles.input}
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            style={styles.button}
            type="submit"
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor)}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = styles.button.backgroundColor)}
          >
            Login
          </button>
        </form>
        <button
          style={{ ...styles.button, ...styles.registerButton }}
          onClick={goToRegister}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = styles.registerButton.backgroundColor)}
        >
          Register
        </button>
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

export default Login;

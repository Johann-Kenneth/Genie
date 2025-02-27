import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  

useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
}, []);

  const register = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('https://genie-production-3591.up.railway.app/auth/register', { username, password });
      setMessage(response.data.message);
      navigate('/login');
    } catch (error) {
      setMessage('Registration failed');
    }
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
      border: '2px solid rgba(255, 255, 255, 0.5)',
      fontSize: '1rem',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      color: '#333',
      outline: 'none',
      transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
      fontFamily: "'Playfair Display', serif",
        fontSize: '16px',
    },
    inputFocus: {
      borderColor: '#4caf50',
      boxShadow: '0 0 8px rgba(76, 175, 80, 0.7)',
    },
    button: {
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
    message: {
      color: '#ff5252',
      fontSize: '0.9rem',
      marginTop: '10px',
    },
    signInButton: {
      width: '100%',
      padding: '15px',
      borderRadius: '25px',
      fontSize: '1rem',
      fontWeight: 'bold',
      backgroundColor: '#1e88e5',  // Blue background for the Sign In button
      color: '#fff',
      border: 'none',
      cursor: 'pointer',
      marginTop: '15px',
      transition: 'all 0.3s ease',
      fontFamily: "'Playfair Display', serif",
        fontSize: '16px',
    },
    signInButtonHover: {
      backgroundColor: '#1976d2',  // Darker blue when hovered
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>
      <div style={styles.content}>
        {/* Branding */}
        <h1 style={styles.heading}>STYLOGENIE</h1>
        <p style={styles.subheading}>Create your account</p>

        {/* Registration Form */}
        <form onSubmit={register} style={styles.form}>
          <input
            style={{ ...styles.input, ...(username && styles.inputFocus) }}
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            onFocus={(e) => e.target.style.borderColor = styles.inputFocus.borderColor}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)'} // Reset on blur
          />
          <input
            style={{ ...styles.input, ...(password && styles.inputFocus) }}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            onFocus={(e) => e.target.style.borderColor = styles.inputFocus.borderColor}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)'} // Reset on blur
          />
          <input
            style={{ ...styles.input, ...(confirmPassword && styles.inputFocus) }}
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            onFocus={(e) => e.target.style.borderColor = styles.inputFocus.borderColor}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)'} // Reset on blur
          />
          <button
            style={styles.button}
            type="submit"
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor)}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = styles.button.backgroundColor)}
          >
            Register
          </button>
        </form>

        {/* Sign In Button */}
        <button
          style={styles.signInButton}
          onClick={() => navigate('/login')}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = styles.signInButtonHover.backgroundColor)}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = styles.signInButton.backgroundColor)}
        >
          Already have an account? Sign In
        </button>

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

export default Register;

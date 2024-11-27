import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

interface LoginFormProps {
  onLoginSuccess: (token: string) => void;
}

interface FormData {
  email: string;
  password: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
  const [message, setMessage] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      onLoginSuccess(response.data.token); // Pass the token to parent
      setMessage('Login successful!');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setMessage('Error: ' + (err.response?.data?.message || 'Something went wrong.'));
      } else {
        setMessage('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="login-form-container">
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="login-input"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="login-input"
          required
        />
        <button type="submit" className="login-button">Login</button>
        {message && <p className="login-message">{message}</p>}
      </form>
    </div>
  );
};

export default LoginForm;

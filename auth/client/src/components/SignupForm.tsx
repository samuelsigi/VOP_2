import React, { useState, ChangeEvent, FormEvent } from 'react';

interface SignupFormProps {
  onSignup: (userData: { name: string; email: string; password: string }) => Promise<void>;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSignup }) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  // Handle change events for inputs
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ): void => {
    setter(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      await onSignup({ name, email, password }); // Delegate signup logic to parent
    } catch (err) {
      console.error('Signup Error:', err);
      setMessage('Signup failed. Please try again.');
    }
  };

  return (
    
    <form className="signup-form" onSubmit={handleSubmit}>
      <div className="input-container">
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => handleInputChange(e, setName)}
          placeholder="Enter your name"
          required
        />
      </div>

      <div className="input-container">
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => handleInputChange(e, setEmail)}
          placeholder="Enter your email"
          required
        />
      </div>

      <div className="input-container">
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => handleInputChange(e, setPassword)}
          placeholder="Enter your password"
          required
        />
      </div>

      <button type="submit" className="signup-button">Sign Up</button>

      {message && <p className="error-message">{message}</p>}
    </form>
  );
};

export default SignupForm;

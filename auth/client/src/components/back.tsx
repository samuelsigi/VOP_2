import React from 'react';

const BackButton: React.FC = () => {
  const handleBack = () => {
    const previousPage = window.location.href;
    sessionStorage.setItem('previousPage', previousPage);
    // Optionally redirect to login page:
    window.location.href = '/';
  };
  

  return (
    <button  className="back-button" onClick={handleBack} >
      Back
    </button>
  );
};

export default BackButton;

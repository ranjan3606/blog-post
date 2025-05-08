import React from 'react';
import './Button.css'; // We'll create this CSS file later if needed

const Button = ({ children, onClick, className, type = 'button' }) => {
  return (
    <button 
      type={type} 
      className={`button ${className || ''}`} 
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
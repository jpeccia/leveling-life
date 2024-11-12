import React from 'react';

type ButtonProps = {
  text: string;
  onClick: () => void;
  className?: string;
};

const Button: React.FC<ButtonProps> = ({ text, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;

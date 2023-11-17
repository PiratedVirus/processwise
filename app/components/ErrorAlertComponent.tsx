// ErrorAlertComponent.tsx
import React from 'react';
import 'tailwindcss/tailwind.css';

interface ErrorAlertComponentProps {
  mainHeader: string;
  subHeader: string;
}

const ErrorAlertComponent: React.FC<ErrorAlertComponentProps> = ({ mainHeader, subHeader }) => {
  return (
    <div className="flex items-center justify-center bg-red-50 p-4 mt-4">
      <div className="flex items-center bg-red-50 text-red-700 px-4 py-3 rounded relative" role="alert">
        <div className="flex items-center justify-center flex-shrink-0 h-12 w-12 rounded-full bg-red-100 sm:h-16 sm:w-16">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 text-red-500 sm:h-8 sm:w-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div className="ml-4 text-sm sm:text-base">
          <p className="font-bold">{mainHeader}</p>
          <p>{subHeader}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorAlertComponent;

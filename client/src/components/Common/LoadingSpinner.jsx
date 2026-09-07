import React from 'react';

const LoadingSpinner = ({ label = 'Loading hostels and reviews...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-sm font-medium text-gray-600">{label}</p>
    </div>
  );
};

export default LoadingSpinner;

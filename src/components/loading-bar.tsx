import React from "react";

const LoadingBar: React.FC = () => {
  return (
    <div className="w-full h-1 bg-gray-200 overflow-hidden">
      <div className="h-full bg-blue-500 animate-simple-loading-bar" />
    </div>
  );
};

export default LoadingBar;

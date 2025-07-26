import React from "react";

export const InputContainer: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="border border-gray-300 p-6 rounded-lg bg-white flex flex-col">
      {children}
    </div>
  );
};

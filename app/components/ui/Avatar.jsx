import React from "react";

export const Avatar = ({ className, ...props }) => {
  return (
    <div
      className={`w-10 h-10 rounded-full bg-gray-300 ${className}`}
      {...props}
    ></div>
  );
};

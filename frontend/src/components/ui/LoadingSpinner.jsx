import React from "react";
import { SpinnerIcon } from "./Icons";

const LoadingSpinner = ({ label = "Loading", className = "", size = 18 }) => (
  <span className={`loading-spinner ${className}`.trim()}>
    <SpinnerIcon size={size} />
    <span>{label}</span>
  </span>
);

export default LoadingSpinner;

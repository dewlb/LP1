import React from "react";
import "./ProgressBar.css";

// Define the expected type for the props
interface ProgressBarProps {
  currentStep: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  const totalSteps = 5; // Total number of steps
  const percentage = (currentStep / totalSteps) * 100;

  // Define descriptions for each step
  const stepDescriptions = [
    "Tournament Info",
    "Participants",
    "Select Sport",
    "Finish",
  ];

  return (
    <div className="progress-bar-wrapper">
      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${percentage}%` }}></div>
      </div>

      {/* Step Descriptions Under the Bar */}
      <div className="step-labels">
        {stepDescriptions.map((desc, index) => (
          <div
            key={index}
            className={`step-label ${
              currentStep >= index + 1 ? "completed" : ""
            }`}
            style={{ width: `${100 / totalSteps}%` }}
          >
            {desc}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;

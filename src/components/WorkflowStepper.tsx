const workflowSteps = [
  "Dashboard",
  "Discover",
  "Filter",
  "Details",
  "Fit Score",
  "Prepare",
  "Review/Approve",
  "Track",
] as const;

export default function WorkflowStepper({ currentStep }: { currentStep: number }) {
  const currentLabel = workflowSteps[currentStep] ?? workflowSteps[0];

  return (
    <nav className="workflow-stepper" aria-label="Student workflow">
      <ol className="workflow-stepper-desktop">
        {workflowSteps.map((step, index) => (
          <li key={step} aria-current={index === currentStep ? "step" : undefined}>
            {step}
          </li>
        ))}
      </ol>
      <p className="workflow-stepper-mobile" aria-current="step">
        Step {currentStep + 1} of {workflowSteps.length}: {currentLabel}
      </p>
    </nav>
  );
}

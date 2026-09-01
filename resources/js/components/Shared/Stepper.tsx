import { Check } from 'lucide-react';

export function Stepper({ currentStep = 2 }: { currentStep?: number }) {
    const steps = [
        { id: 1, label: 'Service', icon: Check },
        { id: 2, label: 'Date & Time', icon: Check },
        { id: 3, label: 'Details', icon: null },
        // { id: 4, label: 'Payment', icon: null },
    ];

    return (
        <div
            className="scrollbar-hide flex items-center justify-start sm:justify-center sm:space-x-4 overflow-x-auto px-4 sm:px-0 py-4"
            id="stepper"
        >
            {steps.map((step, idx) => (
                <div key={step.id} className="flex shrink-0 items-center">
                    <div className="flex items-center space-x-2">
                        <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                                step.id < currentStep
                                    ? 'bg-purple-100 text-purple-600'
                                    : step.id === currentStep
                                      ? 'bg-purple-600 text-white shadow-md'
                                      : 'bg-gray-200 text-gray-500 dark:bg-slate-700 dark:text-slate-100'
                            }`}
                            id={`step-indicator-${step.id}`}
                        >
                            {step.id < currentStep && step.icon ? (
                                <step.icon size={16} />
                            ) : (
                                step.id
                            )}
                        </div>
                        <span
                            className={`text-sm font-medium ${
                                step.id === currentStep
                                    ? 'font-semibold text-gray-900 dark:text-slate-400'
                                    : 'text-gray-500 dark:text-slate-100'
                            }`}
                            id={`step-label-${step.id}`}
                        >
                            {step.label}
                        </span>
                    </div>
                    {idx < steps.length - 1 && (
                        <div
                            className="mx-4 h-[1px] w-12 bg-gray-200"
                            id={`step-divider-${step.id}`}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

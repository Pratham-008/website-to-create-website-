import React from 'react';
import { CheckCircle, Circle, Clock, Loader } from 'lucide-react';
import { Step } from './BuilderPage';

interface StepsListProps {
  steps: Step[];
}

const StepsList: React.FC<StepsListProps> = ({ steps }) => {
  const getStepIcon = (status: Step['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'in-progress':
        return <Loader className="w-5 h-5 text-blue-400 animate-spin" />;
      case 'pending':
        return <Circle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStepColor = (status: Step['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'in-progress':
        return 'text-blue-400';
      case 'pending':
        return 'text-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-4">
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={`relative flex items-start space-x-4 p-4 rounded-lg transition-all duration-300 ${
            step.status === 'in-progress'
              ? 'bg-blue-500/10 border border-blue-500/20'
              : step.status === 'completed'
              ? 'bg-green-500/10 border border-green-500/20'
              : 'bg-gray-800/50 border border-gray-700'
          }`}
        >
          {/* Step Icon */}
          <div className="flex-shrink-0 mt-0.5">
            {getStepIcon(step.status)}
          </div>

          {/* Step Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className={`font-semibold ${getStepColor(step.status)}`}>
                {step.title}
              </h3>
              
            </div>
            <p className="text-sm text-gray-400">{step.description}</p>
            
            {/* Progress Indicator */}
            {step.status === 'in-progress' && (
              <div className="mt-3">
                <div className="w-full bg-gray-700 rounded-full h-1">
                  <div className="bg-blue-400 h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div className="absolute left-6 top-12 w-px h-8 bg-gray-600"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StepsList;
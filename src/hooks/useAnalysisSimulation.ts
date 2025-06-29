import { useState } from 'react';

interface AnalysisStep {
  id: string;
  title: string;
  status: 'pending' | 'active' | 'completed';
  results?: string[];
}

interface AnalysisState {
  isAnalyzing: boolean;
  currentStep: string;
  steps: AnalysisStep[];
  activeCards: string[];
}

const initialState: AnalysisState = {
  isAnalyzing: false,
  currentStep: '',
  steps: [],
  activeCards: [],
};

const analysisStepsConfig = {
  company: [
    { id: 'general', title: 'Gathering general information about the company' },
    { id: 'sources', title: 'Reading sources' },
    { id: 'people', title: 'Finding information about people who work at the company' },
    { id: 'sentiment', title: 'Collecting social media sentiment and public opinion about the company' }
  ],
  person: [
    { id: 'general', title: 'Gathering general information about this person' },
    { id: 'sources', title: 'Reading sources' },
    { id: 'people', title: 'Analyzing professional background and connections' },
    { id: 'sentiment', title: 'Collecting social media sentiment and public opinion about this person' }
  ]
};

export const useAnalysisSimulation = () => {
  const [state, setState] = useState<AnalysisState>(initialState);

  const startAnalysis = (query: string, type: 'company' | 'person') => {
    const steps = analysisStepsConfig[type].map(step => ({ ...step, status: 'pending' as const }));
    setState({
      isAnalyzing: true,
      currentStep: steps[0].title,
      steps: steps,
      activeCards: [],
    });

    let currentStepIndex = 0;
    const interval = setInterval(() => {
      currentStepIndex++;
      if (currentStepIndex >= steps.length) {
        clearInterval(interval);
        setState(prev => ({ ...prev, isAnalyzing: false, currentStep: '' }));
        return;
      }
      
      setState(prev => {
        const newSteps = prev.steps.map((step, index) => {
          if (index < currentStepIndex) return { ...step, status: 'completed' as const };
          if (index === currentStepIndex) return { ...step, status: 'active' as const };
          return step;
        });
        const newActiveCards = newSteps
          .filter(s => s.status === 'completed' || s.status === 'active')
          .map(s => s.id);

        return {
          ...prev,
          steps: newSteps,
          currentStep: newSteps[currentStepIndex].title,
          activeCards: newActiveCards,
        };
      });
    }, 2000);
  };

  const stopAnalysis = () => {
    // This needs to be implemented properly to stop the interval from startAnalysis
    setState(prev => ({ ...prev, isAnalyzing: false }));
  };

  const resetAnalysis = () => {
    setState(initialState);
  };
  
  const setSteps = (steps: AnalysisStep[]) => {
    setState(prev => ({ ...prev, steps }));
  };

  const setIsAnalyzing = (isAnalyzing: boolean) => {
    setState(prev => ({ ...prev, isAnalyzing }));
  };

  const setActiveCards = (activeCards: string[]) => {
    setState(prev => ({ ...prev, activeCards }));
  };

  return { 
    ...state,
    startAnalysis, 
    stopAnalysis, 
    resetAnalysis,
    setSteps,
    setIsAnalyzing,
    setActiveCards
  };
};
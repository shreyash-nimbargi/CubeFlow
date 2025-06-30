import React, { useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Copy, Download } from 'lucide-react';
import { SolutionStep } from '../types/cube';

interface SolutionDisplayProps {
  solution: SolutionStep[];
  isLoading: boolean;
}

const SolutionDisplay: React.FC<SolutionDisplayProps> = ({ solution, isLoading }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const nextStep = () => {
    if (currentStep < solution.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetSteps = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const copySolution = () => {
    const solutionText = solution.map(step => step.move).join(' ');
    navigator.clipboard.writeText(solutionText);
  };

  const downloadSolution = () => {
    const solutionText = solution.map((step, index) => 
      `${index + 1}. ${step.move} - ${step.description}`
    ).join('\n');
    
    const blob = new Blob([solutionText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rubiks-cube-solution.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Auto-play functionality
  React.useEffect(() => {
    if (isPlaying && currentStep < solution.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 2000 / playbackSpeed);
      return () => clearTimeout(timer);
    } else if (isPlaying && currentStep === solution.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, solution.length, playbackSpeed]);

  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-white mb-2">Solving Your Cube</h3>
          <p className="text-white/80">Analyzing patterns and calculating optimal solution...</p>
        </div>
      </div>
    );
  }

  if (solution.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <RotateCcw className="w-8 h-8 text-white/60" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Ready to Solve</h3>
          <p className="text-white/80">Complete your cube configuration to see the solution steps.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Solution Steps</h2>
        <div className="flex space-x-2">
          <button
            onClick={copySolution}
            className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            title="Copy solution"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={downloadSolution}
            className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            title="Download solution"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/80 text-sm">Progress</span>
          <span className="text-white/80 text-sm">{currentStep + 1}/{solution.length}</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / solution.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Step Display */}
      <div className="bg-white/5 rounded-xl p-6 mb-6 border border-white/20">
        <div className="text-center">
          <div className="text-4xl font-bold text-white mb-2 font-mono">
            {solution[currentStep]?.move}
          </div>
          <p className="text-white/80 text-lg">
            {solution[currentStep]?.description}
          </p>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <button
          onClick={resetSteps}
          className="p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
          title="Reset to beginning"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Previous step"
        >
          <SkipBack className="w-5 h-5" />
        </button>

        <button
          onClick={togglePlayback}
          className="p-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </button>

        <button
          onClick={nextStep}
          disabled={currentStep === solution.length - 1}
          className="p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Next step"
        >
          <SkipForward className="w-5 h-5" />
        </button>

        <select
          value={playbackSpeed}
          onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
          className="px-3 py-2 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={0.5}>0.5x</option>
          <option value={1}>1x</option>
          <option value={1.5}>1.5x</option>
          <option value={2}>2x</option>
        </select>
      </div>

      {/* All Steps List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">All Steps</h3>
        <div className="max-h-64 overflow-y-auto">
          {solution.map((step, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                index === currentStep
                  ? 'bg-blue-500/20 border-blue-400 text-blue-400'
                  : 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10'
              }`}
              onClick={() => setCurrentStep(index)}
            >
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium w-6">{index + 1}.</span>
                <span className="font-mono font-bold">{step.move}</span>
              </div>
              <span className="text-sm opacity-75">{step.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SolutionDisplay;
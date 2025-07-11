import React, { useState } from 'react';
import { Camera, Square, RotateCcw, Play, Save, History } from 'lucide-react';
import CameraCaptureMode from './components/CameraCaptureMode';
import ManualInputMode from './components/ManualInputMode';
import SolutionDisplay from './components/SolutionDisplay';
import { CubeState, SolutionStep } from './types/cube';

function App() {
  const [activeMode, setActiveMode] = useState<'camera' | 'manual'>('camera');
  const [cubeState, setCubeState] = useState<CubeState | null>(null);
  const [solution, setSolution] = useState<SolutionStep[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleCubeStateChange = (newState: CubeState | null) => {
    setCubeState(newState);
  };

  const handleSolve = async () => {
    if (!cubeState) return;

    setIsLoading(true);
    // Simulate solving process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock solution steps
    const mockSolution: SolutionStep[] = [
      { move: "R U R' U'", description: "Right hand trigger" },
      { move: "F R U' R' F'", description: "Front right insert" },
      { move: "R U2 R' U2", description: "Right double turn" },
      { move: "R U R' F R F'", description: "Corner orientation" },
      { move: "U R U' R'", description: "Final adjustment" },
    ];

    setSolution(mockSolution);
    setIsLoading(false);
  };

  const resetSolver = () => {
    setCubeState(null);
    setSolution([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Square className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">CubeFlow</h1>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={resetSolver}
                className="flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>

              <button className="flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white transition-colors">
                <History className="w-4 h-4" />
                <span>History</span>
              </button>

              <button className="flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white transition-colors">
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mode Selector */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveMode('camera')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-200 ${
                  activeMode === 'camera'
                    ? 'bg-white text-slate-900 shadow-lg'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Camera className="w-5 h-5" />
                <span className="font-medium">Camera Analysis</span>
              </button>

              <button
                onClick={() => setActiveMode('manual')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-200 ${
                  activeMode === 'manual'
                    ? 'bg-white text-slate-900 shadow-lg'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Square className="w-5 h-5" />
                <span className="font-medium">Manual Input</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Mode */}
          <div className="space-y-6">
            {activeMode === 'camera' ? (
              <CameraCaptureMode onCubeStateChange={handleCubeStateChange} />
            ) : (
              <ManualInputMode onCubeStateChange={handleCubeStateChange} />
            )}

            {/* Solve Button */}
            {cubeState && (
              <div className="flex justify-center">
                <button
                  onClick={handleSolve}
                  disabled={isLoading}
                  className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <Play className="w-6 h-6" />
                  <span>{isLoading ? 'Solving...' : 'Solve Cube'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Solution Display */}
          <div className="space-y-6">
            <SolutionDisplay solution={solution} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
import React, { useState } from 'react';
import { Square, Palette, RotateCcw, Check } from 'lucide-react';
import { CubeState, CubeColor, CubeFace } from '../types/cube';

interface ManualInputModeProps {
  onCubeStateChange: (state: CubeState | null) => void;
}

const ManualInputMode: React.FC<ManualInputModeProps> = ({ onCubeStateChange }) => {
  const [selectedColor, setSelectedColor] = useState<CubeColor>('white');
  const [currentFace, setCurrentFace] = useState<keyof CubeState>('front');
  const [cubeState, setCubeState] = useState<CubeState>({
    front: { colors: Array(3).fill(null).map(() => Array(3).fill('white')) },
    back: { colors: Array(3).fill(null).map(() => Array(3).fill('white')) },
    left: { colors: Array(3).fill(null).map(() => Array(3).fill('white')) },
    right: { colors: Array(3).fill(null).map(() => Array(3).fill('white')) },
    top: { colors: Array(3).fill(null).map(() => Array(3).fill('white')) },
    bottom: { colors: Array(3).fill(null).map(() => Array(3).fill('white')) }
  });

  const colors: { color: CubeColor; label: string; bgClass: string }[] = [
    { color: 'white', label: 'White', bgClass: 'bg-white' },
    { color: 'yellow', label: 'Yellow', bgClass: 'bg-yellow-400' },
    { color: 'red', label: 'Red', bgClass: 'bg-red-500' },
    { color: 'orange', label: 'Orange', bgClass: 'bg-orange-500' },
    { color: 'blue', label: 'Blue', bgClass: 'bg-blue-500' },
    { color: 'green', label: 'Green', bgClass: 'bg-green-500' }
  ];

  const faces: { face: keyof CubeState; label: string }[] = [
    { face: 'front', label: 'Front' },
    { face: 'back', label: 'Back' },
    { face: 'left', label: 'Left' },
    { face: 'right', label: 'Right' },
    { face: 'top', label: 'Top' },
    { face: 'bottom', label: 'Bottom' }
  ];

  const handleSquareClick = (row: number, col: number) => {
    const newCubeState = { ...cubeState };
    newCubeState[currentFace].colors[row][col] = selectedColor;
    setCubeState(newCubeState);
    onCubeStateChange(newCubeState);
  };

  const resetCube = () => {
    const resetState: CubeState = {
      front: { colors: Array(3).fill(null).map(() => Array(3).fill('white')) },
      back: { colors: Array(3).fill(null).map(() => Array(3).fill('white')) },
      left: { colors: Array(3).fill(null).map(() => Array(3).fill('white')) },
      right: { colors: Array(3).fill(null).map(() => Array(3).fill('white')) },
      top: { colors: Array(3).fill(null).map(() => Array(3).fill('white')) },
      bottom: { colors: Array(3).fill(null).map(() => Array(3).fill('white')) }
    };
    setCubeState(resetState);
    onCubeStateChange(null);
  };

  const getColorClass = (color: CubeColor) => {
    const colorMap = {
      white: 'bg-white border-gray-300',
      yellow: 'bg-yellow-400 border-yellow-500',
      red: 'bg-red-500 border-red-600',
      orange: 'bg-orange-500 border-orange-600',
      blue: 'bg-blue-500 border-blue-600',
      green: 'bg-green-500 border-green-600'
    };
    return colorMap[color];
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Manual Input</h2>
        <button
          onClick={resetCube}
          className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>

      {/* Color Palette */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          <Palette className="w-5 h-5 mr-2" />
          Select Color
        </h3>
        <div className="grid grid-cols-6 gap-3">
          {colors.map(({ color, label, bgClass }) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`aspect-square rounded-lg border-2 transition-all ${bgClass} ${
                selectedColor === color
                  ? 'border-white shadow-lg scale-110'
                  : 'border-gray-400 hover:scale-105'
              }`}
              title={label}
            >
              {selectedColor === color && (
                <Check className="w-6 h-6 text-gray-800 mx-auto" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Face Selector */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          <Square className="w-5 h-5 mr-2" />
          Select Face
        </h3>
        <div className="grid grid-cols-6 gap-2">
          {faces.map(({ face, label }) => (
            <button
              key={face}
              onClick={() => setCurrentFace(face)}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                currentFace === face
                  ? 'bg-blue-500 border-blue-400 text-white'
                  : 'bg-white/10 border-white/30 text-white/80 hover:bg-white/20'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Cube Face Grid */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">
          {faces.find(f => f.face === currentFace)?.label} Face
        </h3>
        <div className="inline-block bg-white/5 p-4 rounded-xl border border-white/20">
          <div className="grid grid-cols-3 gap-2">
            {cubeState[currentFace].colors.map((row, rowIndex) =>
              row.map((color, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                  className={`w-16 h-16 rounded-lg border-2 transition-all hover:scale-105 ${getColorClass(color)}`}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-white/5 rounded-lg p-4 border border-white/20">
        <h4 className="text-white font-medium mb-2">Instructions:</h4>
        <ul className="text-white/80 text-sm space-y-1">
          <li>1. Select a color from the palette above</li>
          <li>2. Choose which face you want to edit</li>
          <li>3. Click on squares to assign colors</li>
          <li>4. Complete all 6 faces to solve the cube</li>
        </ul>
      </div>
    </div>
  );
};

export default ManualInputMode;
import React, { useRef, useState, useEffect } from 'react';
import { Camera, Square, Zap, RotateCcw, AlertCircle, Settings } from 'lucide-react';
import { CubeState, CubeColor } from '../types/cube';

interface CameraCaptureModeProps {
  onCubeStateChange: (state: CubeState | null) => void;
}

const CameraCaptureMode: React.FC<CameraCaptureModeProps> = ({ onCubeStateChange }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [permissionError, setPermissionError] = useState<string>('');
  const [currentFace, setCurrentFace] = useState<keyof CubeState>('front');
  const [capturedFaces, setCapturedFaces] = useState<Partial<CubeState>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const faceOrder: (keyof CubeState)[] = ['front', 'back', 'left', 'right', 'top', 'bottom'];

  useEffect(() => {
    initializeCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const initializeCamera = async () => {
    try {
      setPermissionError('');
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported in this browser');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        setHasPermission(true);
      }
    } catch (error: any) {
      console.error('Error accessing camera:', error);
      setHasPermission(false);
      
      // Provide specific error messages based on the error type
      if (error.name === 'NotAllowedError' || error.message.includes('Permission denied')) {
        setPermissionError('Camera access was denied. Please allow camera permissions and refresh the page.');
      } else if (error.name === 'NotFoundError') {
        setPermissionError('No camera found on this device.');
      } else if (error.name === 'NotSupportedError') {
        setPermissionError('Camera access is not supported in this browser.');
      } else if (error.name === 'NotReadableError') {
        setPermissionError('Camera is already in use by another application.');
      } else {
        setPermissionError('Unable to access camera. Please check your browser settings.');
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsStreaming(false);
    }
  };

  const captureFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsAnalyzing(true);
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      
      // Simulate cube face analysis
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock cube face data
      const mockFace = {
        colors: [
          ['red', 'white', 'blue'],
          ['green', 'yellow', 'red'],
          ['blue', 'orange', 'white']
        ] as CubeColor[][]
      };

      const newCapturedFaces = {
        ...capturedFaces,
        [currentFace]: mockFace
      };
      
      setCapturedFaces(newCapturedFaces);
      
      // Move to next face
      const currentIndex = faceOrder.indexOf(currentFace);
      const nextIndex = (currentIndex + 1) % faceOrder.length;
      setCurrentFace(faceOrder[nextIndex]);
      
      // If all faces captured, create complete cube state
      if (Object.keys(newCapturedFaces).length === 6) {
        onCubeStateChange(newCapturedFaces as CubeState);
      }
    }
    
    setIsAnalyzing(false);
  };

  const resetCapture = () => {
    setCapturedFaces({});
    setCurrentFace('front');
    onCubeStateChange(null);
  };

  const getFaceDisplayName = (face: keyof CubeState) => {
    return face.charAt(0).toUpperCase() + face.slice(1);
  };

  const openBrowserSettings = () => {
    // This will help users understand how to enable camera permissions
    alert('To enable camera access:\n\n1. Look for a camera icon in your browser\'s address bar\n2. Click it and select "Allow"\n3. Or go to your browser settings and allow camera access for this site\n4. Refresh the page after granting permission');
  };

  if (hasPermission === false) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Camera className="w-16 h-16 text-white/60" />
              <AlertCircle className="w-6 h-6 text-red-400 absolute -top-1 -right-1" />
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2">Camera Access Required</h3>
          
          <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-4 mb-6">
            <p className="text-red-200 text-sm font-medium mb-2">Permission Error</p>
            <p className="text-red-100 text-sm">{permissionError}</p>
          </div>

          <div className="space-y-4">
            <div className="text-left bg-white/5 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">How to enable camera access:</h4>
              <ol className="text-white/80 text-sm space-y-1 list-decimal list-inside">
                <li>Look for a camera icon in your browser's address bar</li>
                <li>Click it and select "Allow" or "Always allow"</li>
                <li>If no icon appears, check your browser's site settings</li>
                <li>Refresh the page after granting permission</li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={initializeCamera}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Try Again
              </button>
              <button
                onClick={openBrowserSettings}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-medium"
              >
                <Settings className="w-4 h-4" />
                <span>Help with Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Camera Analysis</h2>
        <button
          onClick={resetCapture}
          className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>

      {/* Camera Feed */}
      <div className="relative mb-6">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-64 bg-black rounded-lg object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Overlay Guide */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="border-2 border-white/60 border-dashed w-48 h-48 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Square className="w-8 h-8 text-white/80 mx-auto mb-2" />
              <p className="text-white/80 text-sm">Position {getFaceDisplayName(currentFace)} Face</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/80 text-sm">Capture Progress</span>
          <span className="text-white/80 text-sm">{Object.keys(capturedFaces).length}/6 faces</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(Object.keys(capturedFaces).length / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* Face Indicators */}
      <div className="grid grid-cols-6 gap-2 mb-6">
        {faceOrder.map((face) => (
          <div
            key={face}
            className={`aspect-square rounded-lg border-2 flex items-center justify-center text-xs font-medium transition-all ${
              capturedFaces[face]
                ? 'bg-green-500/20 border-green-400 text-green-400'
                : face === currentFace
                ? 'bg-blue-500/20 border-blue-400 text-blue-400'
                : 'bg-white/10 border-white/30 text-white/60'
            }`}
          >
            {getFaceDisplayName(face)}
          </div>
        ))}
      </div>

      {/* Capture Button */}
      <div className="flex justify-center">
        <button
          onClick={captureFrame}
          disabled={!isStreaming || isAnalyzing}
          className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isAnalyzing ? (
            <>
              <Zap className="w-6 h-6 animate-pulse" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Camera className="w-6 h-6" />
              <span>Capture {getFaceDisplayName(currentFace)} Face</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CameraCaptureMode;
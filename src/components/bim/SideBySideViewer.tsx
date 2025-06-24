
import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { RotateCcw, Maximize2 } from 'lucide-react';
import BIMViewer from './BIMViewer';
import RealityCaptureViewer from './RealityCaptureViewer';

interface SideBySideViewerProps {
  projectId: string;
  bimFile: any;
  onElementSelect: (element: any) => void;
}

const SideBySideViewer: React.FC<SideBySideViewerProps> = ({
  projectId,
  bimFile,
  onElementSelect
}) => {
  const [splitPosition, setSplitPosition] = useState([50]);

  const resetSplit = () => {
    setSplitPosition([50]);
  };

  if (!bimFile) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-muted-foreground">
          <p>Upload a BIM model to use side-by-side comparison</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      {/* Split View Container */}
      <div className="flex h-full">
        {/* Left Panel - BIM Model */}
        <div 
          className="relative border-r border-border/40"
          style={{ width: `${splitPosition[0]}%` }}
        >
          <BIMViewer
            projectId={projectId}
            bimFile={bimFile}
            onElementSelect={onElementSelect}
          />
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md px-3 py-1 text-sm font-medium">
            BIM Model
          </div>
        </div>

        {/* Right Panel - Reality Capture */}
        <div 
          className="relative"
          style={{ width: `${100 - splitPosition[0]}%` }}
        >
          <RealityCaptureViewer projectId={projectId} />
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md px-3 py-1 text-sm font-medium">
            Reality Capture
          </div>
        </div>
      </div>

      {/* Split Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-border cursor-col-resize hover:bg-blue-500 transition-colors z-10"
        style={{ left: `${splitPosition[0]}%` }}
      />

      {/* Controls */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-md p-2 flex items-center gap-4 z-20">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Split:</span>
          <div className="w-32">
            <Slider
              value={splitPosition}
              onValueChange={setSplitPosition}
              max={100}
              min={0}
              step={1}
              className="cursor-pointer"
            />
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={resetSplit}>
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm">
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Split Percentage Display */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-md px-3 py-1 text-xs text-muted-foreground z-20">
        Model: {splitPosition[0]}% | Reality: {100 - splitPosition[0]}%
      </div>
    </div>
  );
};

export default SideBySideViewer;

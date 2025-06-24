
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layers, Calendar, Download, Eye } from 'lucide-react';
import { useCaptureData } from '@/hooks/useCaptureData';

interface RealityCaptureViewerProps {
  projectId: string;
}

const RealityCaptureViewer: React.FC<RealityCaptureViewerProps> = ({ projectId }) => {
  const [selectedCapture, setSelectedCapture] = useState<any>(null);
  const { data: captures, isLoading } = useCaptureData(projectId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-muted-foreground">Loading reality capture data...</p>
        </div>
      </div>
    );
  }

  const latestCapture = captures?.[0];

  return (
    <div className="flex h-full">
      {/* Capture List Sidebar */}
      <div className="w-80 border-r border-border/40 bg-background/50 p-4 overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold">Reality Captures</h3>
          </div>
          
          {captures?.length ? (
            captures.map((capture: any) => (
              <Card 
                key={capture.id}
                className={`p-3 cursor-pointer transition-colors ${
                  selectedCapture?.id === capture.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedCapture(capture)}
              >
                <div className="flex items-start gap-3">
                  <img 
                    src={capture.thumbnail_url || '/placeholder.svg'} 
                    alt="Capture thumbnail"
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{capture.provider}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(capture.capture_date).toLocaleDateString()}
                    </div>
                    <div className="flex gap-1 mt-2">
                      {capture.pano_url && (
                        <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
                          360°
                        </Button>
                      )}
                      {capture.pointcloud_url && (
                        <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
                          Point Cloud
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center text-muted-foreground">
              <Layers className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No reality captures available</p>
              <p className="text-xs mt-1">Connect Track3D or OpenSpace to view captures</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Viewer */}
      <div className="flex-1 relative">
        {selectedCapture || latestCapture ? (
          <div className="w-full h-full">
            {/* Panoramic Viewer */}
            {(selectedCapture?.pano_url || latestCapture?.pano_url) && (
              <iframe
                src={selectedCapture?.pano_url || latestCapture?.pano_url}
                className="w-full h-full border-none"
                title="Reality Capture Viewer"
                allow="fullscreen"
              />
            )}
            
            {/* Controls Overlay */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <Button variant="outline" size="sm" className="bg-white shadow-md">
                <Eye className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="bg-white shadow-md">
                <Download className="w-4 h-4" />
              </Button>
            </div>

            {/* Info Overlay */}
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 text-sm">
              <p className="font-medium">
                {(selectedCapture || latestCapture)?.provider} Capture
              </p>
              <p className="text-muted-foreground text-xs">
                {new Date((selectedCapture || latestCapture)?.capture_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <Card className="p-8 text-center max-w-md">
              <Layers className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Reality Captures</h3>
              <p className="text-muted-foreground mb-4">
                Connect to Track3D or OpenSpace to view reality capture data.
              </p>
              <Button variant="outline">
                Configure Integration
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealityCaptureViewer;

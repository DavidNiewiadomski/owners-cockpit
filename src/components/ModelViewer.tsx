
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Box, Settings, Layers } from 'lucide-react';
import BIMViewer from '@/components/bim/BIMViewer';
import BIMUploadModal from '@/components/bim/BIMUploadModal';
import BIMElementPanel from '@/components/bim/BIMElementPanel';
import RealityCaptureViewer from '@/components/bim/RealityCaptureViewer';
import SideBySideViewer from '@/components/bim/SideBySideViewer';
import { useBIMFiles } from '@/hooks/useBIMFiles';
import { useRole } from '@/contexts/RoleContext';

interface ModelViewerProps {
  projectId: string;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ projectId }) => {
  const { currentRole } = useRole();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [showElementPanel, setShowElementPanel] = useState(false);
  const [activeTab, setActiveTab] = useState('model');

  const { data: bimFiles, isLoading, refetch } = useBIMFiles(projectId);
  const activeBimFile = bimFiles?.find(file => file.is_active);

  const canManage = currentRole === 'Construction' || currentRole === 'Executive';

  const handleElementSelect = (element: any) => {
    setSelectedElement(element);
    setShowElementPanel(true);
    console.log('Selected BIM element:', element);
  };

  const handleUploadSuccess = () => {
    refetch();
    setShowUploadModal(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Box className="w-6 h-6 text-blue-600" />
            <div>
              <h1 className="text-xl font-semibold">3D Model Viewer</h1>
              <p className="text-sm text-muted-foreground">
                {activeBimFile ? `Viewing: ${activeBimFile.filename}` : 'No model loaded'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {canManage && (
              <Button
                onClick={() => setShowUploadModal(true)}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Model
              </Button>
            )}
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Model Sync Tabs */}
      <div className="border-b border-border/40">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="px-6">
          <TabsList className="h-10">
            <TabsTrigger value="model" className="gap-2">
              <Box className="w-4 h-4" />
              Model
            </TabsTrigger>
            <TabsTrigger value="reality" className="gap-2">
              <Layers className="w-4 h-4" />
              Reality
            </TabsTrigger>
            <TabsTrigger value="side-by-side" className="gap-2">
              <Layers className="w-4 h-4" />
              Side-by-Side
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative">
        <Tabs value={activeTab} className="h-full">
          <TabsContent value="model" className="h-full m-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-muted-foreground">Loading BIM models...</p>
                </div>
              </div>
            ) : activeBimFile ? (
              <div className="flex h-full">
                <div className="flex-1">
                  <BIMViewer
                    projectId={projectId}
                    bimFile={activeBimFile}
                    onElementSelect={handleElementSelect}
                  />
                </div>
                
                {/* Element Details Panel */}
                {showElementPanel && selectedElement && (
                  <div className="w-96 border-l border-border/40 bg-background">
                    <BIMElementPanel
                      element={selectedElement}
                      projectId={projectId}
                      onClose={() => setShowElementPanel(false)}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <Card className="p-8 text-center max-w-md">
                  <Box className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No 3D Model Available</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload an IFC or GLTF file to view the 3D model for this project.
                  </p>
                  {canManage && (
                    <Button onClick={() => setShowUploadModal(true)} className="gap-2">
                      <Upload className="w-4 h-4" />
                      Upload Model
                    </Button>
                  )}
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="reality" className="h-full m-0">
            <RealityCaptureViewer projectId={projectId} />
          </TabsContent>

          <TabsContent value="side-by-side" className="h-full m-0">
            <SideBySideViewer 
              projectId={projectId}
              bimFile={activeBimFile}
              onElementSelect={handleElementSelect}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Upload Modal */}
      <BIMUploadModal
        projectId={projectId}
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
};

export default ModelViewer;

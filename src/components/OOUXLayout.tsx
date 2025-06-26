/**
 * OOUX Enhanced Layout
 * 
 * This layout demonstrates the Object-Oriented UX improvements by integrating:
 * - Object-centric navigation instead of role-based navigation
 * - Universal search across all object types
 * - Consistent object cards and detail views
 * - Object relationship visualization
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Bell, Settings, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import OOUX Components
import ObjectNavigation from '@/components/objects/ObjectNavigation';
import ObjectSearch from '@/components/objects/ObjectSearch';
import ObjectCard from '@/components/objects/ObjectCard';
import ObjectDetail from '@/components/objects/ObjectDetail';
import { AnyObject, ProjectObject, CommunicationObject, DocumentObject, ActionItemObject } from '@/types/objects';

// Import existing components
import AppHeader from '@/components/AppHeader';
import MainContent from '@/components/MainContent';
import AIFloatingButton from '@/components/AIFloatingButton';
import AIChatOverlay from '@/components/AIChatOverlay';
import AppModals from '@/components/AppModals';
import VoiceControl from '@/components/VoiceControl';
import { useAppState } from '@/hooks/useAppState';
import { useRole } from '@/contexts/RoleContext';

interface OOUXLayoutProps {
  showOOUXDemo?: boolean;
}

const OOUXLayout: React.FC<OOUXLayoutProps> = ({ showOOUXDemo = false }) => {
  const { currentRole } = useRole();
  const appState = useAppState();
  const [showSearch, setShowSearch] = useState(false);
  const [selectedObject, setSelectedObject] = useState<AnyObject | null>(null);
  const [activeObjectType, setActiveObjectType] = useState('overview');
  const [showOriginalLayout, setShowOriginalLayout] = useState(false);

  // Return to original layout if requested
  if (showOriginalLayout) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader 
          selectedProject={appState.activeView === 'portfolio' ? 'portfolio' : appState.selectedProject}
          onProjectChange={appState.handleProjectChange}
          onUploadToggle={() => appState.setShowUpload(!appState.showUpload)}
          onSettingsToggle={() => appState.setShowSettings(!appState.showSettings)}
          onHeroExit={() => {}}
        />

        <main className="flex-1">
          <MainContent 
            activeView={appState.activeView}
            selectedProject={appState.selectedProject}
          />
        </main>

        <AIFloatingButton onClick={appState.handleAIChat} />

        <AIChatOverlay 
          isOpen={appState.showChatOverlay}
          onClose={appState.handleCloseChatOverlay}
          projectId={appState.selectedProject || 'portfolio'}
          activeView={appState.activeView}
          contextData={{
            selectedProject: appState.selectedProject,
            timestamp: new Date().toISOString()
          }}
        />

        <AppModals
          showSettings={appState.showSettings}
          setShowSettings={appState.setShowSettings}
          showSourceModal={appState.showSourceModal}
          setShowSourceModal={appState.setShowSourceModal}
          showDocumentViewer={appState.showDocumentViewer}
          setShowDocumentViewer={appState.setShowDocumentViewer}
          selectedDocument={appState.selectedDocument}
          setSelectedDocument={appState.setSelectedDocument}
        />

        <VoiceControl />
      </div>
    );
  }

  // Sample OOUX data for demonstration
  const sampleObjects: AnyObject[] = [
    {
      id: 'proj_downtown_office',
      name: 'Downtown Office Building',
      description: 'A 12-story modern office building with sustainable design features',
      type: 'commercial_office',
      phase: 'construction',
      status: 'active',
      health: 'green',
      progress: 65,
      start_date: '2024-01-15',
      end_date: '2024-12-31',
      budget: {
        total: 15000000,
        spent: 9750000,
        remaining: 5250000,
        currency: 'USD'
      },
      organization_id: 'org_1',
      owner_id: 'user_1',
      team_members: ['user_1', 'user_2', 'user_3'],
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-06-25T12:00:00Z',
      actions: {} as any
    } as ProjectObject,
    {
      id: 'comm_weekly_update',
      type: 'meeting',
      title: 'Weekly Project Update',
      subject: 'Downtown Office Project - Week 25 Update',
      body: 'Discussed current progress, upcoming milestones, and resolved three critical issues.',
      sender: { id: 'user_1', name: 'John Smith', email: 'john@construction.com' },
      recipients: [{ id: 'user_2', name: 'Jane Doe', email: 'jane@construction.com' }],
      participants: [{ id: 'user_1', name: 'John Smith' }, { id: 'user_2', name: 'Jane Doe' }],
      message_timestamp: '2024-06-24T10:00:00Z',
      provider: 'teams',
      priority: 'high',
      project_id: 'proj_downtown_office',
      created_at: '2024-06-24T10:00:00Z',
      updated_at: '2024-06-24T10:00:00Z',
      actions: {} as any
    } as CommunicationObject,
    {
      id: 'doc_architectural_plans',
      name: 'Architectural Plans v3.2',
      description: 'Updated architectural plans with client revisions',
      type: 'drawing',
      size: 25600000,
      mime_type: 'application/pdf',
      url: 'https://example.com/plans.pdf',
      category: 'architectural',
      version: 3.2,
      is_latest: true,
      review_status: 'approved',
      project_id: 'proj_downtown_office',
      uploaded_by: 'user_1',
      access_level: 'project_team',
      created_at: '2024-06-20T09:00:00Z',
      updated_at: '2024-06-23T14:30:00Z',
      actions: {} as any
    } as DocumentObject,
    {
      id: 'task_foundation_inspection',
      title: 'Foundation Inspection Approval',
      description: 'Schedule and complete foundation inspection before concrete pour',
      type: 'inspection',
      assigned_to: 'user_3',
      assigned_by: 'user_1',
      status: 'in_progress',
      priority: 'urgent',
      progress: 75,
      due_date: '2024-06-28T17:00:00Z',
      category: 'quality_control',
      project_id: 'proj_downtown_office',
      requires_approval: true,
      created_at: '2024-06-20T08:00:00Z',
      updated_at: '2024-06-25T11:00:00Z',
      actions: {} as any
    } as ActionItemObject
  ];

  const handleObjectClick = (object: AnyObject) => {
    setSelectedObject(object);
    console.log('Selected object:', object);
  };

  const handleNavigate = (path: string, objectType?: string) => {
    if (objectType) {
      setActiveObjectType(objectType);
    }
    console.log('Navigate to:', path, objectType);
  };

  const handleObjectCreate = (objectType: string) => {
    console.log('Create new:', objectType);
    // In a real app, this would open a create modal
  };

  const handleObjectSearch = () => {
    setShowSearch(!showSearch);
  };

  if (!showOOUXDemo) {
    // Return the original layout if OOUX demo is not enabled
    return (
      <div className="min-h-screen bg-background">
        <AppHeader 
          selectedProject={appState.activeView === 'portfolio' ? 'portfolio' : appState.selectedProject}
          onProjectChange={appState.handleProjectChange}
          onUploadToggle={() => appState.setShowUpload(!appState.showUpload)}
          onSettingsToggle={() => appState.setShowSettings(!appState.showSettings)}
          onHeroExit={() => {}}
        />

        <main className="flex-1">
          <MainContent 
            activeView={appState.activeView}
            selectedProject={appState.selectedProject}
          />
        </main>

        <AIFloatingButton onClick={appState.handleAIChat} />

        <AIChatOverlay 
          isOpen={appState.showChatOverlay}
          onClose={appState.handleCloseChatOverlay}
          projectId={appState.selectedProject || 'portfolio'}
          activeView={appState.activeView}
          contextData={{
            selectedProject: appState.selectedProject,
            timestamp: new Date().toISOString()
          }}
        />

        <AppModals
          showSettings={appState.showSettings}
          setShowSettings={appState.setShowSettings}
          showSourceModal={appState.showSourceModal}
          setShowSourceModal={appState.setShowSourceModal}
          showDocumentViewer={appState.showDocumentViewer}
          setShowDocumentViewer={appState.setShowDocumentViewer}
          selectedDocument={appState.selectedDocument}
          setSelectedDocument={appState.setSelectedDocument}
        />

        <VoiceControl />
      </div>
    );
  }

  // OOUX Enhanced Layout
  return (
    <div className="min-h-screen bg-background flex relative">
      {/* Exit OOUX Demo Toggle */}
      <div className="fixed top-2 left-1/2 transform -translate-x-1/2 z-[9999]">
        <Button
          variant="destructive"
          size="lg"
          onClick={() => setShowOriginalLayout(true)}
          className="flex items-center gap-2 shadow-2xl border-2 font-semibold hover:scale-105 transition-all duration-200"
        >
          <X className="h-5 w-5" />
          <span className="text-sm font-bold">Exit OOUX Demo</span>
        </Button>
      </div>
      {/* OOUX Object Navigation Sidebar */}
      <div className="w-80 border-r border-border/40">
        <ObjectNavigation
          currentProject={sampleObjects[0] as ProjectObject}
          currentObject={selectedObject}
          onNavigate={handleNavigate}
          onObjectCreate={handleObjectCreate}
          onObjectSearch={handleObjectSearch}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Header with OOUX Features */}
        <div className="border-b border-border/40 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">OOUX Construction Platform</h1>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowSearch(!showSearch)}
              >
                <Search className="h-4 w-4 mr-2" />
                Universal Search
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Universal Search */}
          {showSearch && (
            <div className="mt-4 p-4 border border-border/40 rounded-lg bg-muted/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Search Across All Objects</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowSearch(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <ObjectSearch
                onResultClick={handleObjectClick}
                placeholder="Search projects, communications, documents, tasks, and people..."
                showFilters={true}
                showHistory={true}
              />
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {selectedObject ? (
            // Object Detail View
            <ObjectDetail
              object={selectedObject}
              onBack={() => setSelectedObject(null)}
              onActionClick={(action) => console.log('Action:', action)}
              onRelatedObjectClick={handleObjectClick}
            />
          ) : (
            // Object Grid View
            <div className="h-full overflow-auto">
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">
                    Object-Oriented UX Demo
                  </h2>
                  <p className="text-muted-foreground">
                    This demonstrates consistent object representation across different types.
                    Click any object to see the unified detail view.
                  </p>
                </div>

                <Tabs value={activeObjectType} onValueChange={setActiveObjectType}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">All Objects</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="communications">Communications</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">All Objects (Unified View)</h3>
                      <div className="grid gap-4">
                        {sampleObjects.map((object) => (
                          <ObjectCard
                            key={object.id}
                            object={object}
                            variant="detailed"
                            showActions={true}
                            showRelationships={true}
                            onClick={() => handleObjectClick(object)}
                            onActionClick={(action) => console.log('Action:', action)}
                          />
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="projects" className="mt-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Projects</h3>
                      <div className="grid gap-4">
                        {sampleObjects
                          .filter(obj => obj.id.startsWith('proj_'))
                          .map((object) => (
                            <ObjectCard
                              key={object.id}
                              object={object}
                              variant="detailed"
                              showActions={true}
                              showRelationships={true}
                              onClick={() => handleObjectClick(object)}
                            />
                          ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="communications" className="mt-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Communications</h3>
                      <div className="grid gap-4">
                        {sampleObjects
                          .filter(obj => obj.id.startsWith('comm_'))
                          .map((object) => (
                            <ObjectCard
                              key={object.id}
                              object={object}
                              variant="detailed"
                              showActions={true}
                              onClick={() => handleObjectClick(object)}
                            />
                          ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="documents" className="mt-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Documents</h3>
                      <div className="grid gap-4">
                        {sampleObjects
                          .filter(obj => obj.id.startsWith('doc_'))
                          .map((object) => (
                            <ObjectCard
                              key={object.id}
                              object={object}
                              variant="detailed"
                              showActions={true}
                              onClick={() => handleObjectClick(object)}
                            />
                          ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Features (kept from original) */}
      <AIFloatingButton onClick={appState.handleAIChat} />

      <AIChatOverlay 
        isOpen={appState.showChatOverlay}
        onClose={appState.handleCloseChatOverlay}
        projectId={appState.selectedProject || 'portfolio'}
        activeView={appState.activeView}
        contextData={{
          selectedProject: appState.selectedProject,
          timestamp: new Date().toISOString()
        }}
      />

      <AppModals
        showSettings={appState.showSettings}
        setShowSettings={appState.setShowSettings}
        showSourceModal={appState.showSourceModal}
        setShowSourceModal={appState.setShowSourceModal}
        showDocumentViewer={appState.showDocumentViewer}
        setShowDocumentViewer={appState.setShowDocumentViewer}
        selectedDocument={appState.selectedDocument}
        setSelectedDocument={appState.setSelectedDocument}
      />

      <VoiceControl />
    </div>
  );
};

export default OOUXLayout;

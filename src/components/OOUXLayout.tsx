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

  // Comprehensive realistic sample data for live demo feel
  const sampleObjects: AnyObject[] = [
    // PROJECTS
    {
      id: 'proj_downtown_office',
      name: 'Downtown Office Tower',
      description: '42-story Class A office building with LEED Platinum certification, 1.2M sq ft, featuring sky gardens and advanced building automation',
      type: 'commercial_office',
      phase: 'construction',
      status: 'active',
      health: 'yellow',
      progress: 68,
      start_date: '2024-01-15',
      end_date: '2025-08-30',
      location: { address: '150 Main Street', city: 'Chicago', state: 'IL', country: 'USA' },
      budget: { total: 285000000, spent: 194000000, remaining: 91000000, currency: 'USD' },
      organization_id: 'org_1',
      owner_id: 'user_1',
      team_members: ['user_1', 'user_2', 'user_3', 'user_4', 'user_5'],
      created_at: '2024-01-01T00:00:00Z',
      updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      actions: {} as any
    } as ProjectObject,
    {
      id: 'proj_residential_complex',
      name: 'Riverside Residential Complex',
      description: 'Mixed-income housing development with 240 units across 4 buildings, including affordable housing component and community center',
      type: 'residential_multi_family',
      phase: 'preconstruction',
      status: 'active',
      health: 'green',
      progress: 85,
      start_date: '2024-03-01',
      end_date: '2025-11-15',
      location: { address: '2800 Riverside Drive', city: 'Seattle', state: 'WA', country: 'USA' },
      budget: { total: 95000000, spent: 81000000, remaining: 14000000, currency: 'USD' },
      organization_id: 'org_1',
      owner_id: 'user_2',
      team_members: ['user_2', 'user_6', 'user_7'],
      created_at: '2024-02-15T00:00:00Z',
      updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      actions: {} as any
    } as ProjectObject,
    {
      id: 'proj_warehouse_expansion',
      name: 'Distribution Center Phase 2',
      description: '500,000 sq ft automated warehouse facility with advanced robotics and sustainable design elements',
      type: 'industrial_warehouse',
      phase: 'construction',
      status: 'on_hold',
      health: 'red',
      progress: 32,
      start_date: '2024-05-01',
      end_date: '2025-03-30',
      location: { address: '4500 Industrial Parkway', city: 'Phoenix', state: 'AZ', country: 'USA' },
      budget: { total: 125000000, spent: 40000000, remaining: 85000000, currency: 'USD' },
      organization_id: 'org_1',
      owner_id: 'user_3',
      team_members: ['user_3', 'user_8', 'user_9'],
      created_at: '2024-04-01T00:00:00Z',
      updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
      actions: {} as any
    } as ProjectObject,

    // COMMUNICATIONS
    {
      id: 'comm_foundation_delay',
      type: 'email',
      title: 'URGENT: Foundation Pour Delayed Due to Weather',
      subject: 'Downtown Office Tower - Foundation Pour Postponement',
      body: 'Due to unexpected severe weather conditions forecasted for this week, we need to postpone the foundation pour originally scheduled for Thursday. The concrete supplier has confirmed availability for next Monday. This delay will impact the critical path by 3 days, but we can potentially recover time during the framing phase. Please confirm attendance for the emergency coordination meeting tomorrow at 7 AM.',
      sender: { id: 'user_4', name: 'Mike Rodriguez', email: 'mrodriguez@constructioncorp.com' },
      recipients: [{ id: 'user_1', name: 'Sarah Johnson' }, { id: 'user_2', name: 'David Chen' }],
      participants: [{ id: 'user_4', name: 'Mike Rodriguez' }],
      message_timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
      provider: 'outlook',
      priority: 'urgent',
      project_id: 'proj_downtown_office',
      created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      actions: {} as any
    } as CommunicationObject,
    {
      id: 'comm_safety_meeting',
      type: 'meeting',
      title: 'Weekly Safety Coordination Meeting',
      subject: 'Multi-Project Safety Review & Compliance Update',
      body: 'Agenda: 1) Review of last week\'s incidents (2 minor cuts, 1 near-miss), 2) New safety protocols for crane operations, 3) PPE inspection results, 4) Training schedule for Q3, 5) Weather contingency plans. All site supervisors must attend.',
      sender: { id: 'user_5', name: 'Lisa Parker', email: 'lparker@safety.com' },
      recipients: [{ id: 'user_1', name: 'Sarah Johnson' }, { id: 'user_4', name: 'Mike Rodriguez' }, { id: 'user_6', name: 'Tom Wilson' }],
      participants: [{ id: 'user_5', name: 'Lisa Parker' }, { id: 'user_1', name: 'Sarah Johnson' }],
      message_timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // yesterday
      provider: 'teams',
      priority: 'high',
      project_id: 'proj_downtown_office',
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      actions: {} as any
    } as CommunicationObject,
    {
      id: 'comm_budget_alert',
      type: 'chat',
      title: 'Budget Variance Alert - Riverside Project',
      subject: 'Material costs trending 8% over budget',
      body: 'Hey team, getting an alert that our steel costs are trending higher than expected. Current variance is 8% over budget on structural materials. Supplier mentioned global pricing increases. Need to discuss mitigation strategies ASAP. Can we meet tomorrow to review alternatives?',
      sender: { id: 'user_6', name: 'Tom Wilson', email: 'twilson@pm.com' },
      recipients: [{ id: 'user_2', name: 'David Chen' }, { id: 'user_7', name: 'Emily Davis' }],
      participants: [{ id: 'user_6', name: 'Tom Wilson' }, { id: 'user_2', name: 'David Chen' }],
      message_timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      provider: 'teams',
      priority: 'high',
      project_id: 'proj_residential_complex',
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      actions: {} as any
    } as CommunicationObject,

    // DOCUMENTS
    {
      id: 'doc_structural_drawings',
      name: 'Structural Drawings Package Rev 4.1',
      description: 'Complete structural engineering drawings including foundation details, steel framing plans, and connection details. Updated to address city review comments.',
      type: 'drawing',
      size: 47500000, // 47.5 MB
      mime_type: 'application/pdf',
      url: 'https://example.com/structural-rev4.1.pdf',
      category: 'structural',
      version: 4.1,
      is_latest: true,
      review_status: 'approved',
      project_id: 'proj_downtown_office',
      uploaded_by: 'user_8',
      access_level: 'project_team',
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
      updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
      actions: {} as any
    } as DocumentObject,
    {
      id: 'doc_permit_application',
      name: 'Building Permit Amendment - Floor 15-20',
      description: 'Permit amendment for mechanical system modifications on floors 15-20. Required due to updated HVAC specifications from client.',
      type: 'pdf',
      size: 3200000, // 3.2 MB
      mime_type: 'application/pdf',
      url: 'https://example.com/permit-amendment.pdf',
      category: 'permits',
      version: 1,
      is_latest: true,
      review_status: 'pending',
      project_id: 'proj_downtown_office',
      uploaded_by: 'user_1',
      access_level: 'managers_only',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      actions: {} as any
    } as DocumentObject,
    {
      id: 'doc_material_contract',
      name: 'Steel Supply Contract - Amendment #3',
      description: 'Contract amendment for additional steel materials required due to design changes. Includes pricing for upgraded seismic connections.',
      type: 'contract',
      size: 890000, // 890 KB
      mime_type: 'application/pdf',
      url: 'https://example.com/steel-contract-amendment.pdf',
      category: 'contracts',
      version: 3,
      is_latest: true,
      review_status: 'in_review',
      project_id: 'proj_downtown_office',
      uploaded_by: 'user_3',
      access_level: 'confidential',
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      updated_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
      actions: {} as any
    } as DocumentObject,
    {
      id: 'doc_safety_inspection',
      name: 'Monthly Safety Inspection Report - June 2024',
      description: 'Comprehensive safety inspection covering all active work areas, equipment status, and compliance verification. 3 minor violations noted and corrected.',
      type: 'report',
      size: 5600000, // 5.6 MB
      mime_type: 'application/pdf',
      url: 'https://example.com/safety-june-2024.pdf',
      category: 'reports',
      version: 1,
      is_latest: true,
      review_status: 'approved',
      project_id: 'proj_downtown_office',
      uploaded_by: 'user_5',
      access_level: 'project_team',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      actions: {} as any
    } as DocumentObject,

    // ACTION ITEMS / TASKS
    {
      id: 'task_foundation_inspection',
      title: 'Foundation Inspection Coordination',
      description: 'Schedule and coordinate foundation inspection with city inspector. Concrete pour cannot proceed until inspection is complete and approved. Inspector availability is limited this week.',
      type: 'inspection',
      assigned_to: 'user_4',
      assigned_by: 'user_1',
      status: 'in_progress',
      priority: 'urgent',
      progress: 75,
      due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // tomorrow
      category: 'quality_control',
      project_id: 'proj_downtown_office',
      requires_approval: true,
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      actions: {} as any
    } as ActionItemObject,
    {
      id: 'task_permit_submission',
      title: 'Submit Revised Permit Application',
      description: 'Submit the revised building permit application with updated HVAC drawings. City planning department requires all documents by Friday to maintain schedule.',
      type: 'approval',
      assigned_to: 'user_1',
      assigned_by: 'user_1',
      status: 'pending_review',
      priority: 'high',
      progress: 90,
      due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // day after tomorrow
      category: 'compliance',
      project_id: 'proj_downtown_office',
      requires_approval: false,
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
      actions: {} as any
    } as ActionItemObject,
    {
      id: 'task_steel_delivery',
      title: 'Coordinate Steel Beam Delivery - Floors 8-12',
      description: 'Coordinate delivery of structural steel beams for floors 8-12. Crane availability confirmed for next week. Need to verify site access and staging area preparation.',
      type: 'delivery',
      assigned_to: 'user_6',
      assigned_by: 'user_4',
      status: 'open',
      priority: 'normal',
      progress: 25,
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // next week
      category: 'procurement',
      project_id: 'proj_downtown_office',
      requires_approval: false,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      actions: {} as any
    } as ActionItemObject,
    {
      id: 'task_budget_review',
      title: 'Q2 Budget Variance Analysis',
      description: 'Complete comprehensive review of Q2 budget performance across all projects. Focus on material cost overruns and labor efficiency metrics. Prepare presentation for board meeting.',
      type: 'review',
      assigned_to: 'user_2',
      assigned_by: 'user_1',
      status: 'completed',
      priority: 'high',
      progress: 100,
      due_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // completed 3 days ago
      category: 'budget',
      project_id: 'proj_residential_complex',
      requires_approval: true,
      created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      actions: {} as any
    } as ActionItemObject,

    // USERS/PEOPLE
    {
      id: 'user_sarah_johnson',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@ownerscorp.com',
      avatar_url: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=3b82f6&color=fff',
      primary_role: 'Executive',
      title: 'VP of Development',
      department: 'Executive Leadership',
      phone: '+1 (555) 123-4567',
      status: 'active',
      organization_id: 'org_1',
      managed_projects: ['proj_downtown_office', 'proj_residential_complex'],
      assigned_projects: ['proj_downtown_office', 'proj_residential_complex', 'proj_warehouse_expansion'],
      created_at: '2024-01-01T00:00:00Z',
      updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      permissions: [],
      preferences: {} as any,
      notification_settings: {} as any,
      actions: {} as any
    } as UserObject,
    {
      id: 'user_mike_rodriguez',
      name: 'Mike Rodriguez',
      email: 'mike.rodriguez@constructioncorp.com',
      avatar_url: 'https://ui-avatars.com/api/?name=Mike+Rodriguez&background=10b981&color=fff',
      primary_role: 'Construction',
      title: 'Senior Project Manager',
      department: 'Construction Operations',
      phone: '+1 (555) 234-5678',
      status: 'active',
      organization_id: 'org_1',
      managed_projects: ['proj_downtown_office'],
      assigned_projects: ['proj_downtown_office'],
      created_at: '2024-01-15T00:00:00Z',
      updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      permissions: [],
      preferences: {} as any,
      notification_settings: {} as any,
      actions: {} as any
    } as UserObject
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

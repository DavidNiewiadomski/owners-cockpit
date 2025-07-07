import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EditableBidLevelingBoard } from '@/components/procurement/EditableBidLevelingBoard';
import { BidUploadModal } from '@/components/procurement/BidUploadModal';
import { seedBidData, generateSeedBidData } from '@/lib/bidDataSeed';
import { useToast } from '@/hooks/use-toast';
import {
  Upload,
  Database,
  BarChart3,
  FileSpreadsheet,
  Zap,
  CheckCircle,
  Play,
  RefreshCw,
  Settings,
  Download,
  Eye
} from 'lucide-react';

interface DemoBidAnalysisPageProps {}

export default function DemoBidAnalysisPage({}: DemoBidAnalysisPageProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedingComplete, setSeedingComplete] = useState(false);
  const [rfpData, setRfpData] = useState({
    id: 'RFP-2024-002',
    title: 'MEP Systems Installation - Municipal Building Complex',
    description: 'Complete mechanical, electrical, and plumbing systems for new 250,000 sq ft municipal building complex including offices, community center, and parking structure.',
    budget: 8500000,
    bidDueDate: '2024-09-15',
    status: 'active'
  });
  const { toast } = useToast();

  const demoSteps = [
    {
      title: 'Project Setup',
      description: 'Configure RFP parameters and requirements',
      icon: Settings,
      status: 'completed'
    },
    {
      title: 'Bid Collection',
      description: 'Upload and import vendor bid submissions',
      icon: Upload,
      status: demoStep >= 1 ? 'completed' : 'pending'
    },
    {
      title: 'Data Processing',
      description: 'Parse and validate bid data automatically',
      icon: Database,
      status: demoStep >= 2 ? 'completed' : 'pending'
    },
    {
      title: 'Analysis Engine',
      description: 'Run comprehensive bid analysis and leveling',
      icon: BarChart3,
      status: demoStep >= 3 ? 'completed' : 'pending'
    },
    {
      title: 'Award Decision',
      description: 'Generate recommendations and reports',
      icon: CheckCircle,
      status: demoStep >= 4 ? 'completed' : 'pending'
    }
  ];

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    try {
      // Generate sample bid data
      const sampleBids = generateSeedBidData(rfpData.id, 6);
      
      // Simulate database seeding (in real implementation, this would call seedBidData)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setSeedingComplete(true);
      setDemoStep(2);
      
      toast({
        title: "Database Seeded Successfully",
        description: `${sampleBids.length} sample bids have been generated and are ready for analysis.`,
      });
    } catch (error) {
      console.error('Error seeding database:', error);
      toast({
        title: "Seeding Error",
        description: "Failed to seed the database with sample data.",
        variant: "destructive"
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleBidsUploaded = (newBids: any[]) => {
    setDemoStep(Math.max(demoStep, 1));
    toast({
      title: "Bids Uploaded Successfully",
      description: `${newBids.length} bid(s) have been uploaded and are ready for processing.`,
    });
  };

  const handleCompleteDemo = () => {
    setDemoStep(4);
    toast({
      title: "Demo Complete",
      description: "The bid analysis workflow has been successfully demonstrated.",
    });
  };

  const renderDemoOverview = () => (
    <div className="space-y-6">
      {/* Project Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            RFP Project Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">{rfpData.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">{rfpData.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">RFP ID:</span>
                  <span>{rfpData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Budget Estimate:</span>
                  <span>${rfpData.budget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Bid Due Date:</span>
                  <span>{rfpData.bidDueDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <Badge className="bg-green-100 text-green-700">{rfpData.status}</Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Project Scope</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>HVAC Systems (23 00 00)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Electrical Systems (26 00 00)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Plumbing Systems (22 00 00)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Fire Protection (21 00 00)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Building Automation (25 00 00)</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Workflow Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            Bid Analysis Workflow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {demoSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === demoStep;
              const isCompleted = step.status === 'completed';
              
              return (
                <div 
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                    isActive 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : isCompleted 
                        ? 'border-green-200 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 bg-gray-50 dark:bg-gray-900/20'
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    isCompleted 
                      ? 'bg-green-500 text-white' 
                      : isActive 
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${isActive ? 'text-blue-700' : isCompleted ? 'text-green-700' : 'text-gray-700'}`}>
                      {step.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                  <div>
                    {isCompleted && <CheckCircle className="w-5 h-5 text-green-500" />}
                    {isActive && <div className="w-5 h-5 border-2 border-blue-500 rounded-full animate-pulse" />}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Demo Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Demo Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={() => setShowUploadModal(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Sample Bids
            </Button>
            
            <Button 
              onClick={handleSeedDatabase}
              disabled={isSeeding || seedingComplete}
              variant="outline"
            >
              {isSeeding ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Database className="w-4 h-4 mr-2" />
              )}
              {isSeeding ? 'Seeding...' : seedingComplete ? 'Database Seeded' : 'Seed Database'}
            </Button>
            
            <Button 
              onClick={() => setActiveTab('analysis')}
              variant="outline"
              disabled={demoStep < 1}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analysis
            </Button>
            
            <Button 
              onClick={handleCompleteDemo}
              variant="outline"
              disabled={demoStep < 3}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Complete Demo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Bid Analysis System Demo</h1>
            <p className="text-muted-foreground">
              Complete workflow demonstration for bid upload, processing, and analysis
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Demo Mode</Badge>
            <Badge className="bg-blue-100 text-blue-700">
              Step {demoStep + 1} of {demoSteps.length}
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Demo Overview
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Live Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {renderDemoOverview()}
          </TabsContent>

          <TabsContent value="analysis">
            <EditableBidLevelingBoard
              rfpId={rfpData.id}
              rfpTitle={rfpData.title}
              onComplete={(results) => {
                console.log('Analysis completed:', results);
                handleCompleteDemo();
              }}
            />
          </TabsContent>
        </Tabs>

        {/* Upload Modal */}
        <BidUploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          rfpId={rfpData.id}
          rfpTitle={rfpData.title}
          onBidsUploaded={handleBidsUploaded}
        />
      </div>
    </div>
  );
}

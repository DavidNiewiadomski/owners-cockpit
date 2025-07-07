import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Plus, 
  ArrowLeft,
  Trophy,
  Gavel,
  BarChart3,
  Users,
  Clock,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Layers,
  Target,
  Send,
  Eye,
  Edit,
  Settings
} from 'lucide-react';
import { RfpManager } from '@/components/rfp/RfpManager';
import { LevelingBoard } from '@/components/bidding/LevelingBoard';
import { BidLevelingBoard } from './BidLevelingBoard';
import { AwardCenter } from './AwardCenter';
import PrequalDashboard from './PrequalDashboard';
import LeadTimeBoard from './LeadTimeBoard';
import { useRfps } from '@/hooks/useRfpData';
// import { useBidCore } from '@/hooks/useBidCore';

interface ProcurementManagerProps {
  facilityId?: string;
  onClose?: () => void;
  initialView?: 'overview' | 'rfp' | 'bidding' | 'awards';
}

type ViewMode = 'overview' | 'rfp' | 'bidding' | 'awards' | 'prequalification' | 'leadtime' | 'rfp-detail' | 'bid-detail' | 'award-detail';

export function ProcurementManager({ 
  facilityId, 
  onClose, 
  initialView = 'overview' 
}: ProcurementManagerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(initialView);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { rfps: bids, loading } = useRfps();

  // Calculate statistics
  const rfpStats = {
    draft: bids.filter(r => r.status === 'draft').length,
    published: bids.filter(r => r.status === 'open').length,
    closed: bids.filter(r => r.status === 'awarded').length,
    total: bids.length
  };

  const bidStats = {
    evaluation: bids.filter(b => b.status === 'evaluation').length,
    leveling_complete: bids.filter(b => b.status === 'leveling_complete').length,
    bafo_requested: bids.filter(b => b.status === 'bafo_requested').length,
    awarded: bids.filter(b => b.status === 'awarded').length,
    total: bids.length
  };

  const handleViewRfp = (rfpId: string) => {
    setSelectedId(rfpId);
    setViewMode('rfp-detail');
  };

  const handleViewBid = (bidId: string) => {
    setSelectedId(bidId);
    setViewMode('bid-detail');
  };

  const handleViewAward = (bidId: string) => {
    setSelectedId(bidId);
    setViewMode('award-detail');
  };

  const renderBreadcrumb = () => {
    const breadcrumbItems = [];
    
    switch (viewMode) {
      case 'rfp':
        breadcrumbItems.push({ label: 'RFP Management', current: true });
        break;
      case 'bidding':
        breadcrumbItems.push({ label: 'Bid Evaluation', current: true });
        break;
      case 'awards':
        breadcrumbItems.push({ label: 'Award Center', current: true });
        break;
      case 'rfp-detail':
        breadcrumbItems.push({ label: 'RFP Management', onClick: () => setViewMode('rfp') });
        breadcrumbItems.push({ label: 'RFP Details', current: true });
        break;
      case 'bid-detail':
        breadcrumbItems.push({ label: 'Bid Evaluation', onClick: () => setViewMode('bidding') });
        breadcrumbItems.push({ label: 'Bid Details', current: true });
        break;
      case 'award-detail':
        breadcrumbItems.push({ label: 'Award Center', onClick: () => setViewMode('awards') });
        breadcrumbItems.push({ label: 'Award Details', current: true });
        break;
      default:
        return null;
    }

    return (
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setViewMode('overview')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Procurement Overview
        </Button>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            <span className="text-muted-foreground">/</span>
            {item.onClick ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={item.onClick}
                className="font-medium"
              >
                {item.label}
              </Button>
            ) : (
              <span className="font-medium">{item.label}</span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const ProcurementOverview = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Procurement Management</h2>
          <p className="text-muted-foreground">
            Manage your entire procurement lifecycle from RFPs to awards
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setViewMode('rfp')} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create RFP
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active RFPs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rfpStats.published}</div>
            <p className="text-xs text-muted-foreground">
              {rfpStats.draft} drafts, {rfpStats.closed} closed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bids in Evaluation</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bidStats.evaluation}</div>
            <p className="text-xs text-muted-foreground">
              {bidStats.leveling_complete} leveled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">BAFO Requests</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bidStats.bafo_requested}</div>
            <p className="text-xs text-muted-foreground">
              Best and final offers pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Awards Issued</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bidStats.awarded}</div>
            <p className="text-xs text-muted-foreground">
              Contracts awarded this quarter
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Process Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200" onClick={() => setViewMode('rfp')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              RFP Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Create, publish, and manage Request for Proposals
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Published RFPs</span>
                <span className="font-medium">{rfpStats.published}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Draft RFPs</span>
                <span className="font-medium">{rfpStats.draft}</span>
              </div>
            </div>
            <Button className="w-full" variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Manage RFPs
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200" onClick={() => setViewMode('bidding')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Layers className="h-6 w-6 text-green-600" />
              </div>
              Bid Evaluation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Evaluate, level, and score submitted bids
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>In Evaluation</span>
                <span className="font-medium">{bidStats.evaluation}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Leveling Complete</span>
                <span className="font-medium">{bidStats.leveling_complete}</span>
              </div>
            </div>
            <Button className="w-full" variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              Evaluate Bids
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200" onClick={() => setViewMode('awards')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Trophy className="h-6 w-6 text-blue-600" />
              </div>
              Award Center
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Issue awards and manage contracts
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>BAFO Requested</span>
                <span className="font-medium">{bidStats.bafo_requested}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Awards Issued</span>
                <span className="font-medium">{bidStats.awarded}</span>
              </div>
            </div>
            <Button className="w-full" variant="outline">
              <Trophy className="w-4 h-4 mr-2" />
              Award Center
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200" onClick={() => setViewMode('prequalification')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              Prequalification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Manage vendor prequalification & risk assessment
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Pending Review</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Approved Vendors</span>
                <span className="font-medium">42</span>
              </div>
            </div>
            <Button className="w-full" variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Manage Vendors
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200" onClick={() => setViewMode('leadtime')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              Lead Time Board
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Gantt-style view with AI-powered delivery predictions
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Active Packages</span>
                <span className="font-medium">15</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Late Items</span>
                <span className="font-medium text-red-600">3</span>
              </div>
            </div>
            <Button className="w-full" variant="outline">
              <Clock className="w-4 h-4 mr-2" />
              View Timeline
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent RFPs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent RFPs
              </span>
              <Button variant="ghost" size="sm" onClick={() => setViewMode('rfp')}>
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bids.slice(0, 3).map((bid) => (
                <div 
                  key={bid.id} 
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 cursor-pointer"
                  onClick={() => handleViewRfp(bid.id)}
                >
                  <div className="flex-1">
                    <div className="font-medium">{bid.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {bid.rfp_number} • {new Date(bid.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge variant={bid.status === 'open' ? 'default' : 'secondary'}>
                    {bid.status.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
              {bids.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No RFPs yet. Create your first RFP to get started.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Bids */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Gavel className="h-5 w-5" />
                Active Bids
              </span>
              <Button variant="ghost" size="sm" onClick={() => setViewMode('bidding')}>
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bids.slice(0, 3).map((bid) => (
                <div 
                  key={bid.id} 
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 cursor-pointer"
                  onClick={() => bid.status === 'awarded' ? handleViewAward(bid.id) : handleViewBid(bid.id)}
                >
                  <div className="flex-1">
                    <div className="font-medium">{bid.title}</div>
                    <div className="text-sm text-muted-foreground">
                      RFP {bid.rfp_number} • {new Date(bid.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={bid.status === 'awarded' ? 'default' : 'secondary'}>
                      {bid.status.replace('_', ' ')}
                    </Badge>
                    {bid.status === 'awarded' && (
                      <div className="text-xs text-muted-foreground mt-1">
                        <Trophy className="w-3 h-3 inline mr-1" />
                        Awarded
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {bids.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No active bids. Publish an RFP to start receiving bids.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-background">
      {/* Breadcrumb Navigation */}
      {renderBreadcrumb()}

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <ProcurementOverview />
          </motion.div>
        )}

        {viewMode === 'rfp' && (
          <motion.div
            key="rfp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <RfpManager 
              facilityId={facilityId} 
              onClose={() => setViewMode('overview')}
            />
          </motion.div>
        )}

        {viewMode === 'bidding' && (
          <motion.div
            key="bidding"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Bid Evaluation</h2>
                  <p className="text-muted-foreground">
                    Evaluate and level submitted bids
                  </p>
                </div>
              </div>
              
              {/* Show available RFPs for evaluation */}
              {bids.filter(b => b.status === 'evaluation' || b.status === 'open').length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {bids.filter(b => b.status === 'evaluation' || b.status === 'open').map((bid) => (
                    <Card key={bid.id} className="cursor-pointer hover:shadow-lg transition-all" onClick={() => handleViewBid(bid.id)}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{bid.title}</span>
                          <Badge variant={bid.status === 'evaluation' ? 'default' : 'secondary'}>
                            {bid.status === 'evaluation' ? 'Ready for Analysis' : 'Open for Bids'}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>RFP Number:</span>
                            <span className="font-medium">{bid.rfp_number}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Updated:</span>
                            <span>{new Date(bid.updated_at).toLocaleDateString()}</span>
                          </div>
                          <Button className="w-full mt-4" variant="outline">
                            <Gavel className="w-4 h-4 mr-2" />
                            {bid.status === 'evaluation' ? 'Analyze Bids' : 'View RFP'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center h-64">
                    <Gavel className="w-16 h-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Bids Available for Evaluation</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Publish RFPs and wait for bid submissions to start evaluation
                    </p>
                    <Button onClick={() => setViewMode('rfp')}>
                      Go to RFP Management
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.div>
        )}

        {viewMode === 'awards' && (
          <motion.div
            key="awards"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <div className="space-y-6">
              {bids.filter(b => b.status === 'leveling_complete' || b.status === 'awarded').map((bid) => (
                <AwardCenter
                  key={bid.id}
                  bidId={bid.id}
                  bidTitle={bid.title}
                  rfpNumber={bid.rfp_number}
                  submissions={[]} // This would come from the bid submissions
                  currentStatus={bid.status}
                />
              ))}
              {bids.filter(b => b.status === 'leveling_complete' || b.status === 'awarded').length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center h-64">
                    <Trophy className="w-16 h-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Bids Ready for Award</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Complete bid evaluation and leveling to issue awards
                    </p>
                    <Button onClick={() => setViewMode('bidding')}>
                      Go to Bid Evaluation
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.div>
        )}

        {viewMode === 'award-detail' && selectedId && (
          <motion.div
            key="award-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {(() => {
              const bid = bids.find(b => b.id === selectedId);
              if (!bid) return <div>Bid not found</div>;
              
              return (
                <AwardCenter
                  bidId={bid.id}
                  bidTitle={bid.title}
                  rfpNumber={bid.rfp_number}
                  submissions={[]} // This would come from the bid submissions
                  currentStatus={bid.status}
                />
              );
            })()}
          </motion.div>
        )}

        {viewMode === 'prequalification' && (
          <motion.div
            key="prequalification"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <PrequalDashboard />
          </motion.div>
        )}

        {viewMode === 'leadtime' && (
          <motion.div
            key="leadtime"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <LeadTimeBoard rfpId={selectedId || undefined} onSelectItem={(itemId) => console.log('Selected item:', itemId)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { RfpDashboard } from './RfpDashboard';
import { RfpWizardEnhanced } from './RfpWizardEnhanced';
import type { Rfp } from '@/types/rfp';

interface RfpManagerProps {
  facilityId?: string;
  onClose?: () => void;
}

type ViewMode = 'dashboard' | 'create' | 'edit';

export function RfpManager({ facilityId, onClose }: RfpManagerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [selectedRfp, setSelectedRfp] = useState<Rfp | null>(null);

  const handleCreateNew = () => {
    setSelectedRfp(null);
    setViewMode('create');
  };

  const handleEditRfp = (rfp: Rfp) => {
    setSelectedRfp(rfp);
    setViewMode('edit');
  };

  const handleWizardComplete = (rfp: Rfp) => {
    setViewMode('dashboard');
    setSelectedRfp(null);
  };

  const handleWizardCancel = () => {
    setViewMode('dashboard');
    setSelectedRfp(null);
  };

  const renderBreadcrumb = () => {
    switch (viewMode) {
      case 'create':
        return (
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleWizardCancel}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">Create New RFP</span>
          </div>
        );
      case 'edit':
        return (
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleWizardCancel}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">
              Edit: {selectedRfp?.title || 'RFP'}
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full bg-background">
      {/* Breadcrumb Navigation */}
      {renderBreadcrumb()}

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <RfpDashboard
              facilityId={facilityId}
              onCreateNew={handleCreateNew}
              onEditRfp={handleEditRfp}
            />
          </motion.div>
        )}

        {(viewMode === 'create' || viewMode === 'edit') && (
          <motion.div
            key="wizard"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <RfpWizardEnhanced
              facilityId={facilityId}
              existingRfp={selectedRfp}
              mode={viewMode === 'edit' ? 'edit' : 'create'}
              onComplete={handleWizardComplete}
              onCancel={handleWizardCancel}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

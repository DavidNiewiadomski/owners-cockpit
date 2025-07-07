import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Zap } from 'lucide-react';
import type { RfpWizardData } from '../RfpWizardEnhanced';
import type { Rfp } from '@/types/rfp';

interface PublishPaneEnhancedProps {
  data: RfpWizardData;
  rfp: Rfp | null;
  onComplete?: (rfp: Rfp) => void;
  errors?: string[];
}

export function PublishPaneEnhanced({ data, rfp, onComplete, errors = [] }: PublishPaneEnhancedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Send className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Publish & Share</h2>
        <p className="text-muted-foreground">
          Final review, approvals, and distribution - Coming Soon
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Enhanced Publishing Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This enhanced publish pane will include:
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>• Automated approval workflows</li>
            <li>• Multi-channel distribution</li>
            <li>• Vendor notification system</li>
            <li>• Document version control</li>
            <li>• Analytics and tracking</li>
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Zap } from 'lucide-react';
import type { RfpWizardData } from '../RfpWizardEnhanced';
import type { Rfp } from '@/types/rfp';

interface PreviewPaneEnhancedProps {
  data: RfpWizardData;
  rfp: Rfp | null;
  errors?: string[];
}

export function PreviewPaneEnhanced({ data, rfp, errors = [] }: PreviewPaneEnhancedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Eye className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Live Preview</h2>
        <p className="text-muted-foreground">
          Real-time document preview and validation - Coming Soon
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Enhanced Preview Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This enhanced preview pane will include:
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>• Real-time PDF generation</li>
            <li>• Interactive document editing</li>
            <li>• Section-by-section review</li>
            <li>• Validation and completeness checking</li>
            <li>• Export in multiple formats</li>
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}

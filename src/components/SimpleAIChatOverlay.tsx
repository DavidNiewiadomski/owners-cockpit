import React from 'react';
import { Button } from '@/components/ui/button';
import { X, MessageSquare } from 'lucide-react';

interface SimpleAIChatOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  activeView?: string;
  contextData?: any;
}

const SimpleAIChatOverlay: React.FC<SimpleAIChatOverlayProps> = ({ 
  isOpen, 
  onClose, 
  projectId, 
  activeView = 'dashboard',
  contextData 
}) => {
  
  console.log('🟢 SimpleAIChatOverlay render - isOpen:', isOpen);
  
  if (!isOpen) {
    console.log('🔴 SimpleAIChatOverlay not open, returning null');
    return null;
  }

  console.log('🟢 SimpleAIChatOverlay rendering overlay');

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div className="bg-white border border-gray-300 shadow-xl rounded-lg overflow-hidden w-[800px] h-[600px] max-w-[90vw] max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">AI Assistant (Debug Mode)</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-8 h-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 h-[500px] flex flex-col">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-blue-800 mb-2">Debug Information</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li><strong>Project ID:</strong> {projectId}</li>
              <li><strong>Active View:</strong> {activeView}</li>
              <li><strong>Context Data:</strong> {contextData ? JSON.stringify(contextData) : 'None'}</li>
              <li><strong>Timestamp:</strong> {new Date().toLocaleString()}</li>
            </ul>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-green-800 mb-2">Success!</h3>
            <p className="text-sm text-green-700">
              ✅ The AI Chat Overlay is now successfully rendering!<br/>
              ✅ Click events are working<br/>
              ✅ React state management is functional<br/>
              ✅ Component mounting and unmounting works
            </p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-yellow-800 mb-2">Next Steps</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>1. Replace with the full AdvancedAIChat component</li>
              <li>2. Re-add framer-motion animations gradually</li>
              <li>3. Test voice recognition and text-to-speech</li>
              <li>4. Connect to Supabase AI backend</li>
            </ul>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">AI Chat functionality will be restored here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleAIChatOverlay;

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Plus,
  X,
  Search,
  Sparkles,
  CheckCircle,
  Book,
  Code,
  PlusCircle,
  Building2,
  Target,
  FileText,
  AlertTriangle,
  Download,
  Upload,
  Zap,
  Settings,
  Filter,
  ChevronDown,
  ChevronRight,
  Layers,
  Clock,
  DollarSign,
  Users,
} from 'lucide-react';
import { rfpService } from '@/services/rfpService';

interface ScopeItem {
  id: string;
  csiCode: string;
  title: string;
  description: string;
  specifications: string[];
  deliverables: string[];
  exclusions: string[];
  dependencies: string[];
  estimatedCost?: number;
  duration?: number;
  resources?: string[];
  riskLevel: 'low' | 'medium' | 'high';
  complexity: number;
  selected: boolean;
}

interface ScopeBuilderProps {
  onSave: (scopeData: any) => void;
  initialData?: any;
}

export function ScopeBuilder({ onSave, initialData }: ScopeBuilderProps) {
  const [scopeItems, setScopeItems] = useState<ScopeItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCSICodes, setSelectedCSICodes] = useState<string[]>([]);
  const [selectedDivision, setSelectedDivision] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('builder');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [filterComplexity, setFilterComplexity] = useState(0);
  const [customScope, setCustomScope] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [availableCSICodes, setAvailableCSICodes] = useState<any[]>([]);
  const [generatedScope, setGeneratedScope] = useState('');

  // Load CSI codes from service
  useEffect(() => {
    loadCSICodes();
  }, []);

  const loadCSICodes = async () => {
    try {
      const { data, error } = await rfpService.getCSICodes();
      if (data && !error) {
        setAvailableCSICodes(data);
      }
    } catch (error) {
      console.error('Error loading CSI codes:', error);
    }
  };

  const handleGenerateScope = async () => {
    setIsGenerating(true);
    try {
      const context = {
        selectedCSICodes,
        customScope,
        projectType: 'general' // This would come from parent component
      };
      
      const prompt = `Generate a comprehensive scope of work description for the following CSI codes: ${selectedCSICodes.join(', ')}. Include detailed specifications, deliverables, and exclusions.`;
      
      const { data, error } = await rfpService.generateAIContent(prompt, context);
      if (data && !error) {
        setGeneratedScope(data);
      }
    } catch (error) {
      console.error('Error generating scope:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveScope = () => {
    const scopeData = {
      csiCodes: selectedCSICodes,
      description: generatedScope || customScope,
      specifications: availableCSICodes
        .filter(code => selectedCSICodes.includes(code.code))
        .flatMap(code => code.specifications),
      exclusions: []
    };
    onSave(scopeData);
  };

  const handleAddCSICode = (code: string) => {
    if (!selectedCSICodes.includes(code)) {
      setSelectedCSICodes([...selectedCSICodes, code]);
    }
  };

  const handleRemoveCSICode = (code: string) => {
    setSelectedCSICodes(selectedCSICodes.filter(c => c !== code));
  };

  const filteredCSICodes = availableCSICodes.filter(code =>
    code.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.code.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Scope Builder</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Define the scope of work using CSI MasterFormat codes with AI assistance
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* CSI Code Selection */}
        <div className="space-y-4">
          <Label>CSI MasterFormat Codes</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search CSI codes or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="border rounded-lg max-h-96 overflow-y-auto">
            {filteredCSICodes.length > 0 ? (
              filteredCSICodes.map((csi) => (
                <div
                  key={csi.code}
                  className="p-3 border-b last:border-b-0 hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => handleAddCSICode(csi.code)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium">{csi.title}</div>
                    <Badge variant="outline">{csi.code}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{csi.description}</p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No CSI codes found matching your search.</p>
              </div>
            )}
          </div>
        </div>

        {/* Scope Definition */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Selected Divisions</Label>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={handleGenerateScope}
              disabled={isGenerating || selectedCSICodes.length === 0}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate Scope'}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 p-3 border rounded-lg min-h-[100px]">
            {selectedCSICodes.map((code) => (
            <Badge
              key={code}
              variant="secondary"
              className="cursor-pointer hover:bg-destructive/20 transition-colors"
              onClick={() => handleRemoveCSICode(code)}
            >
              {code}
              <X className="w-3 h-3 ml-1" />
            </Badge>
            ))}
            {selectedCSICodes.length === 0 && (
              <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
                Select CSI codes to define scope
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Generated Scope Description</Label>
            <Textarea
              placeholder="AI-generated scope description will appear here..."
              value={generatedScope || customScope}
              onChange={(e) => setCustomScope(e.target.value)}
              rows={8}
            />
          </div>

          <div className="space-y-2">
            <Label>Compliance Requirements</Label>
            <Card>
              <CardContent className="p-4 space-y-3">
                {availableCSICodes
                  .filter(csi => selectedCSICodes.includes(csi.code))
                  .map((csi) => (
                    <div key={csi.code}>
                      <div className="font-medium mb-2">{csi.title}</div>
                      <div className="space-y-2">
                        {csi.specifications?.map((spec, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <Checkbox id={`spec-${csi.code}-${index}`} />
                            <Label htmlFor={`spec-${csi.code}-${index}`} className="text-sm">
                              {spec}
                            </Label>
                          </div>
                        )) || []}
                      </div>
                    </div>
                  ))}
                {selectedCSICodes.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Select CSI codes to see compliance requirements</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Book className="w-4 h-4 mr-2" />
                Load Template
              </Button>
              <Button variant="outline" size="sm">
                <Code className="w-4 h-4 mr-2" />
                View Code Analysis
              </Button>
            </div>
            <Button onClick={handleSaveScope} disabled={selectedCSICodes.length === 0}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Save Scope
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

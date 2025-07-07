import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TreeSelect } from '@/components/ui/tree-select';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Alert } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Search, Copy, Plus } from 'lucide-react';
import { useDraftScopeOfWork, useSearchClauses } from '@/hooks/useRfpDrafter';

interface ScopeBuilderProps {
  data: {
    title: string;
    facility_id: string;
    budget_cap?: number;
    compliance: Record<string, any>;
    scope_items: Array<{ csi_code: string; description: string }>;
  };
  onDataChange: (data: Partial<typeof data>) => void;
  rfpId?: string;
}

export function ScopeBuilder({ data, onDataChange }: ScopeBuilderProps) {
  const [generatedScopeOfWork, setGeneratedScopeOfWork] = useState<string>('');
  const [clauseSearchQuery, setClauseSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('selector');

  const { data: csiCodes, isLoading, error } = useQuery(['csiCodes'], async () => {
    // Mock CSI codes for demo - in production this would come from /reference/csi
    return [
      { code: '01000', description: 'General Requirements', children: [
        { code: '01100', description: 'Summary of Work' },
        { code: '01200', description: 'Multiple Contract Summary' },
        { code: '01300', description: 'Administrative Requirements' },
        { code: '01400', description: 'Quality Requirements' },
        { code: '01500', description: 'Temporary Facilities and Controls' }
      ]},
      { code: '02000', description: 'Existing Conditions', children: [
        { code: '02100', description: 'Site Assessment' },
        { code: '02200', description: 'Site Preparation' },
        { code: '02300', description: 'Earthwork' }
      ]},
      { code: '03000', description: 'Concrete', children: [
        { code: '03100', description: 'Concrete Forms and Accessories' },
        { code: '03200', description: 'Concrete Reinforcement' },
        { code: '03300', description: 'Cast-in-Place Concrete' }
      ]},
      { code: '04000', description: 'Masonry', children: [
        { code: '04200', description: 'Unit Masonry' },
        { code: '04400', description: 'Stone' }
      ]},
      { code: '05000', description: 'Metals', children: [
        { code: '05100', description: 'Structural Metal Framing' },
        { code: '05500', description: 'Metal Fabrications' }
      ]},
      { code: '06000', description: 'Wood, Plastics, and Composites', children: [
        { code: '06100', description: 'Rough Carpentry' },
        { code: '06400', description: 'Architectural Woodwork' }
      ]},
      { code: '07000', description: 'Thermal and Moisture Protection', children: [
        { code: '07100', description: 'Dampproofing and Waterproofing' },
        { code: '07200', description: 'Thermal Protection' },
        { code: '07500', description: 'Membrane Roofing' }
      ]},
      { code: '08000', description: 'Openings', children: [
        { code: '08100', description: 'Metal Doors and Frames' },
        { code: '08800', description: 'Glazing' }
      ]},
      { code: '09000', description: 'Finishes', children: [
        { code: '09200', description: 'Plaster and Gypsum Board' },
        { code: '09600', description: 'Flooring' },
        { code: '09900', description: 'Paints and Coatings' }
      ]},
      { code: '21000', description: 'Fire Suppression', children: [
        { code: '21100', description: 'Water-Based Fire-Suppression Systems' }
      ]},
      { code: '22000', description: 'Plumbing', children: [
        { code: '22100', description: 'Plumbing Piping and Pumps' },
        { code: '22400', description: 'Plumbing Fixtures' }
      ]},
      { code: '23000', description: 'Heating, Ventilating, and Air Conditioning (HVAC)', children: [
        { code: '23100', description: 'Facility Fuel Systems' },
        { code: '23300', description: 'Air Distribution' },
        { code: '23800', description: 'Decentralized Energy Equipment' }
      ]},
      { code: '26000', description: 'Electrical', children: [
        { code: '26100', description: 'Electrical Operation and Maintenance' },
        { code: '26200', description: 'Raceway and Boxes' },
        { code: '26500', description: 'Lighting' }
      ]},
      { code: '27000', description: 'Communications', children: [
        { code: '27100', description: 'Structured Cabling' },
        { code: '27400', description: 'Mass Notification Systems' }
      ]},
      { code: '28000', description: 'Electronic Safety and Security', children: [
        { code: '28100', description: 'Electronic Access Control and Intrusion Detection' },
        { code: '28200', description: 'Electronic Surveillance' }
      ]}
    ];
  });

  const { draftScopeOfWork, loading: draftLoading, error: draftError } = useDraftScopeOfWork();
  const { searchClauses, loading: searchLoading, error: searchError } = useSearchClauses();

  const handleScopeChange = (value: string[]) => {
    const newScopeItems = value.map(code => {
      // Find the code in the nested structure
      let foundItem = null;
      for (const category of csiCodes || []) {
        if (category.code === code) {
          foundItem = category;
          break;
        }
        if (category.children) {
          foundItem = category.children.find((child: any) => child.code === code);
          if (foundItem) break;
        }
      }
      return {
        csi_code: code,
        description: foundItem?.description || '',
      };
    });
    onDataChange({ scope_items: newScopeItems });
  };

  const handleGenerateScopeOfWork = async () => {
    try {
      const projectMeta = {
        title: data.title,
        facility_id: data.facility_id,
        budget_cap: data.budget_cap,
        compliance: data.compliance
      };
      
      const result = await draftScopeOfWork(projectMeta, data.scope_items);
      setGeneratedScopeOfWork(result.markdown);
      setActiveTab('generated');
    } catch (error) {
      console.error('Failed to generate scope of work:', error);
    }
  };

  const handleSearchClauses = async () => {
    if (!clauseSearchQuery.trim()) return;
    
    try {
      const result = await searchClauses(clauseSearchQuery);
      setSearchResults(result.clauses || []);
    } catch (error) {
      console.error('Failed to search clauses:', error);
    }
  };

  const insertClause = (clause: any) => {
    const updatedContent = generatedScopeOfWork + '\n\n' + clause.content;
    setGeneratedScopeOfWork(updatedContent);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (isLoading) return <Spinner />;
  if (error) return <Alert variant="destructive">Failed to load CSI codes</Alert>;

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="selector">CSI Code Selection</TabsTrigger>
          <TabsTrigger value="generated">AI Generated Content</TabsTrigger>
          <TabsTrigger value="search">Clause Library</TabsTrigger>
        </TabsList>
        
        <TabsContent value="selector" className="space-y-4">
          <Card className="bg-gray-800 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white">Select Project Scope</CardTitle>
              <p className="text-gray-400">Choose the CSI divisions and sections that apply to your project</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <TreeSelect
                data={csiCodes || []}
                value={data.scope_items.map(item => item.csi_code)}
                onChange={handleScopeChange}
                placeholder="Select CSI codes for your project scope"
              />
              
              {data.scope_items.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-white font-medium">Selected Scope Items:</h4>
                  <div className="space-y-2">
                    {data.scope_items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                        <div>
                          <Badge variant="outline" className="mb-1">{item.csi_code}</Badge>
                          <p className="text-white text-sm">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    onClick={handleGenerateScopeOfWork}
                    disabled={draftLoading}
                    className="w-full flex items-center space-x-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{draftLoading ? 'Generating...' : 'AI Generate Scope of Work'}</span>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="generated" className="space-y-4">
          <Card className="bg-gray-800 border-gray-600">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">AI Generated Scope of Work</CardTitle>
                {generatedScopeOfWork && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(generatedScopeOfWork)}
                    className="flex items-center space-x-1"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {generatedScopeOfWork ? (
                <div className="space-y-4">
                  <Textarea
                    value={generatedScopeOfWork}
                    onChange={(e) => setGeneratedScopeOfWork(e.target.value)}
                    className="min-h-96 font-mono text-sm"
                    placeholder="Generated scope of work will appear here..."
                  />
                  <div className="text-sm text-gray-400">
                    This content was generated based on your project details and selected CSI codes.
                    You can edit it directly or use the clause library to add additional content.
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No generated content yet. Select scope items and click "AI Generate Scope of Work" to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="search" className="space-y-4">
          <Card className="bg-gray-800 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white">Clause Library Search</CardTitle>
              <p className="text-gray-400">Search for standard RFP clauses and add them to your scope of work</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={clauseSearchQuery}
                  onChange={(e) => setClauseSearchQuery(e.target.value)}
                  placeholder="Search for clauses (e.g., 'MWBE requirements', 'ADA compliance', 'sustainability')..."
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchClauses()}
                />
                <Button
                  onClick={handleSearchClauses}
                  disabled={searchLoading || !clauseSearchQuery.trim()}
                  className="flex items-center space-x-1"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </Button>
              </div>
              
              {searchResults.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-white font-medium">Search Results:</h4>
                  {searchResults.map((clause, index) => (
                    <div key={index} className="p-4 bg-gray-700 rounded-lg space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="text-white font-medium">{clause.title}</h5>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {clause.category}
                            </Badge>
                            {clause.subcategory && (
                              <Badge variant="outline" className="text-xs">
                                {clause.subcategory}
                              </Badge>
                            )}
                            <span className="text-xs text-gray-400">
                              {Math.round(clause.similarity * 100)}% match
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => insertClause(clause)}
                          className="flex items-center space-x-1 ml-2"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add</span>
                        </Button>
                      </div>
                      <p className="text-gray-300 text-sm line-clamp-3">
                        {clause.content.substring(0, 200)}...
                      </p>
                    </div>
                  ))}
                </div>
              )}
              
              {searchLoading && (
                <div className="text-center py-4">
                  <Spinner size="sm" />
                  <p className="text-gray-400 text-sm mt-2">Searching clause library...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

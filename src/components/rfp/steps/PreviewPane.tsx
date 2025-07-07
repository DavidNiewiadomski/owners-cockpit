import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  Eye, 
  Refresh, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Building
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface PreviewPaneProps {
  data: {
    title: string;
    facility_id: string;
    budget_cap?: number;
    release_date?: string;
    proposal_due?: string;
    contract_start?: string;
    scope_items: Array<{ csi_code: string; description: string }>;
    timeline_events: Array<{ name: string; deadline: string; mandatory: boolean }>;
    compliance: { [key: string]: any };
  };
  onDataChange: (data: Partial<typeof data>) => void;
  rfpId?: string;
}

export function PreviewPane({ data, rfpId }: PreviewPaneProps) {
  const [previewMode, setPreviewMode] = useState<'summary' | 'pdf'>('summary');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // Fetch PDF preview
  const { data: pdfPreview, isLoading: pdfLoading, refetch: refetchPdf } = useQuery({
    queryKey: ['rfp-preview', rfpId],
    queryFn: async () => {
      if (!rfpId) return null;
      
      const response = await fetch(`/rfp/${rfpId}/preview`);
      if (!response.ok) throw new Error('Failed to generate PDF preview');
      
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    },
    enabled: !!rfpId && previewMode === 'pdf',
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (pdfPreview) {
      setPdfUrl(pdfPreview);
    }
  }, [pdfPreview]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const getComplianceRequirements = () => {
    return Object.entries(data.compliance)
      .filter(([key, value]) => value === true)
      .map(([key]) => key.toUpperCase());
  };

  const getMandatoryEvents = () => {
    return data.timeline_events.filter(event => event.mandatory);
  };

  const getOptionalEvents = () => {
    return data.timeline_events.filter(event => !event.mandatory);
  };

  const handleDownloadPdf = async () => {
    if (!rfpId) return;
    
    try {
      const response = await fetch(`/rfp/${rfpId}/preview?download=true`);
      if (!response.ok) throw new Error('Failed to download PDF');
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `RFP-${data.title.replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download PDF:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Preview Controls */}
      <Card className="bg-gray-800 border-gray-600">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>RFP Preview</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Tabs value={previewMode} onValueChange={(value) => setPreviewMode(value as 'summary' | 'pdf')}>
                <TabsList>
                  <TabsTrigger value="summary" className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>Summary</span>
                  </TabsTrigger>
                  <TabsTrigger value="pdf" className="flex items-center space-x-1">
                    <FileText className="w-4 h-4" />
                    <span>PDF</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              {rfpId && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetchPdf()}
                    disabled={pdfLoading}
                    className="flex items-center space-x-1"
                  >
                    <Refresh className={`w-4 h-4 ${pdfLoading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </Button>
                  
                  <Button
                    size="sm"
                    onClick={handleDownloadPdf}
                    className="flex items-center space-x-1"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Preview Content */}
      {previewMode === 'summary' ? (
        <div className="space-y-6">
          {/* Project Overview */}
          <Card className="bg-gray-800 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Building className="w-5 h-5" />
                <span>Project Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">Title</label>
                  <p className="text-white">{data.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Facility ID</label>
                  <p className="text-white">{data.facility_id}</p>
                </div>
                {data.budget_cap && (
                  <div>
                    <label className="text-sm font-medium text-gray-400">Budget Cap</label>
                    <p className="text-white">{formatCurrency(data.budget_cap)}</p>
                  </div>
                )}
                {data.release_date && (
                  <div>
                    <label className="text-sm font-medium text-gray-400">Release Date</label>
                    <p className="text-white">{formatDate(data.release_date)}</p>
                  </div>
                )}
                {data.proposal_due && (
                  <div>
                    <label className="text-sm font-medium text-gray-400">Proposal Due</label>
                    <p className="text-white">{formatDate(data.proposal_due)}</p>
                  </div>
                )}
                {data.contract_start && (
                  <div>
                    <label className="text-sm font-medium text-gray-400">Contract Start</label>
                    <p className="text-white">{formatDate(data.contract_start)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Project Scope */}
          <Card className="bg-gray-800 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white">Project Scope</CardTitle>
            </CardHeader>
            <CardContent>
              {data.scope_items.length === 0 ? (
                <p className="text-gray-400">No scope items defined</p>
              ) : (
                <div className="space-y-3">
                  {data.scope_items.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-700 rounded-lg">
                      <Badge variant="outline" className="mt-1">
                        {item.csi_code}
                      </Badge>
                      <div className="flex-1">
                        <p className="text-white">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="bg-gray-800 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Project Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="mandatory">
                <TabsList>
                  <TabsTrigger value="mandatory">
                    Mandatory Events ({getMandatoryEvents().length})
                  </TabsTrigger>
                  <TabsTrigger value="optional">
                    Optional Events ({getOptionalEvents().length})
                  </TabsTrigger>
                  <TabsTrigger value="all">
                    All Events ({data.timeline_events.length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="mandatory" className="space-y-3 mt-4">
                  {getMandatoryEvents().map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <span className="text-white">{event.name}</span>
                      </div>
                      <div className="text-gray-400">{formatDate(event.deadline)}</div>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="optional" className="space-y-3 mt-4">
                  {getOptionalEvents().map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span className="text-white">{event.name}</span>
                      </div>
                      <div className="text-gray-400">{formatDate(event.deadline)}</div>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="all" className="space-y-3 mt-4">
                  {data.timeline_events.map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {event.mandatory ? (
                          <AlertCircle className="w-4 h-4 text-red-400" />
                        ) : (
                          <Clock className="w-4 h-4 text-blue-400" />
                        )}
                        <span className="text-white">{event.name}</span>
                        {event.mandatory && (
                          <Badge variant="destructive" className="text-xs">Mandatory</Badge>
                        )}
                      </div>
                      <div className="text-gray-400">{formatDate(event.deadline)}</div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Compliance Requirements */}
          <Card className="bg-gray-800 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Compliance Requirements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getComplianceRequirements().length === 0 ? (
                <p className="text-gray-400">No specific compliance requirements selected</p>
              ) : (
                <div className="space-y-2">
                  {getComplianceRequirements().map((requirement, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-white">{requirement}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        /* PDF Preview */
        <Card className="bg-gray-800 border-gray-600">
          <CardContent className="p-6">
            {pdfLoading ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <Refresh className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
                  <p className="text-gray-400">Generating PDF preview...</p>
                </div>
              </div>
            ) : pdfUrl ? (
              <div className="h-96 w-full">
                <iframe
                  src={pdfUrl}
                  className="w-full h-full border-0 rounded-lg"
                  title="RFP PDF Preview"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">PDF preview not available</p>
                  <p className="text-sm text-gray-500">
                    Complete all previous steps and save the RFP to generate a PDF preview
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

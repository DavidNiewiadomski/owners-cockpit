import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Download, 
  FileText, 
  Trophy, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  Send,
  Eye
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Submission {
  id: string
  vendor_name: string
  vendor_contact_email: string
  total_price: number
  technical_score: number
  commercial_score: number
  composite_score: number
  rank: number
  status: string
  compliance: {
    bond_submitted: boolean
    insurance_submitted: boolean
    prequalification_passed: boolean
  }
  strengths: string[]
  weaknesses: string[]
}

interface AwardPackage {
  id: string
  contract_number: string
  contract_value: number
  award_memo_url?: string
  award_memo_generated_at?: string
  docusign_status: string
  vendor_acceptance_status: string
  created_at: string
}

interface AwardCenterProps {
  bidId?: string
  bidTitle?: string
  rfpNumber?: string
  submissions?: Submission[]
  currentStatus?: string
  facilityId?: string
  onClose?: () => void
}

export function AwardCenter({ 
  bidId = 'demo-bid-001', 
  bidTitle = 'Sample RFP for Structural Steel', 
  rfpNumber = 'RFP-2024-001', 
  submissions = [
    {
      id: 'sub-001',
      vendor_name: 'Metropolitan Steel Works',
      vendor_contact_email: 'contact@metrosteel.com',
      total_price: 3200000,
      technical_score: 92.5,
      commercial_score: 88.0,
      composite_score: 90.3,
      rank: 1,
      status: 'shortlisted',
      compliance: {
        bond_submitted: true,
        insurance_submitted: true,
        prequalification_passed: true
      },
      strengths: ['Excellent track record', 'Competitive pricing', 'Strong technical capability'],
      weaknesses: ['Limited local presence']
    },
    {
      id: 'sub-002',
      vendor_name: 'Premier Construction LLC',
      vendor_contact_email: 'info@premierconstruction.com',
      total_price: 3450000,
      technical_score: 89.0,
      commercial_score: 85.5,
      composite_score: 87.3,
      rank: 2,
      status: 'shortlisted',
      compliance: {
        bond_submitted: true,
        insurance_submitted: true,
        prequalification_passed: true
      },
      strengths: ['Local presence', 'Fast delivery'],
      weaknesses: ['Higher cost', 'Limited steel experience']
    },
    {
      id: 'sub-003',
      vendor_name: 'Industrial Solutions Corp',
      vendor_contact_email: 'bids@industrialsolutions.com',
      total_price: 3800000,
      technical_score: 85.0,
      commercial_score: 82.0,
      composite_score: 83.5,
      rank: 3,
      status: 'submitted',
      compliance: {
        bond_submitted: true,
        insurance_submitted: false,
        prequalification_passed: true
      },
      strengths: ['Good reputation'],
      weaknesses: ['High cost', 'Missing insurance documentation']
    }
  ], 
  currentStatus = 'evaluation',
  facilityId,
  onClose
}: AwardCenterProps) {
  const [awardPackage, setAwardPackage] = useState<AwardPackage | null>(null)
  const [loading, setLoading] = useState(false)
  const [isAwardDialogOpen, setIsAwardDialogOpen] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState<string>('')
  const [awardForm, setAwardForm] = useState({
    contract_value: 0,
    selection_rationale: '',
    price_basis: '',
    funding_source: ''
  })
  const { toast } = useToast()

  // Load existing award package if it exists
  useEffect(() => {
    if (currentStatus === 'awarded') {
      loadAwardPackage()
    }
  }, [bidId, currentStatus])

  const loadAwardPackage = async () => {
    try {
      const response = await fetch(`/api/award-center/rfp/${bidId}/memo`)
      if (response.ok) {
        const data = await response.json()
        setAwardPackage(data)
      }
    } catch (error) {
      console.error('Failed to load award package:', error)
    }
  }

  const handleCreateAward = async () => {
    if (!selectedSubmission) {
      toast({
        title: "Error",
        description: "Please select a winning submission",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/award-center/rfp/${bidId}/award`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          winning_submission_id: selectedSubmission,
          contract_value: awardForm.contract_value,
          selection_rationale: {
            summary: awardForm.selection_rationale,
            technical_justification: "Based on comprehensive technical evaluation",
            commercial_justification: "Competitive pricing with best value proposition"
          },
          price_basis: {
            analysis: awardForm.price_basis,
            market_comparison: "Within acceptable range of estimates"
          },
          funding_source: {
            details: awardForm.funding_source,
            budget_code: "TBD",
            approval_reference: "TBD"
          }
        })
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "Success",
          description: "Award package created successfully! Award memo is being generated.",
        })
        setIsAwardDialogOpen(false)
        await loadAwardPackage()
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create award')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadMemo = async () => {
    try {
      const response = await fetch(`/api/award-center/rfp/${bidId}/memo`)
      if (response.ok) {
        const data = await response.json()
        if (data.memo_url) {
          window.open(data.memo_url, '_blank')
        } else {
          toast({
            title: "Info",
            description: "Award memo is still being generated. Please try again in a moment.",
          })
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download memo",
        variant: "destructive"
      })
    }
  }

  const handleRegenerateMemo = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/award-center/rfp/${bidId}/regenerate-memo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template_updates: {
            selection_rationale: awardForm.selection_rationale,
            price_basis: awardForm.price_basis,
            funding_source: awardForm.funding_source
          }
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Award memo regenerated successfully!",
        })
        await loadAwardPackage()
      } else {
        throw new Error('Failed to regenerate memo')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      'submitted': 'default',
      'shortlisted': 'default',
      'rejected': 'destructive',
      'awarded': 'default'
    }
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>
  }

  const getComplianceIcon = (passed: boolean) => {
    return passed ? 
      <CheckCircle className="h-4 w-4 text-green-500" /> : 
      <AlertCircle className="h-4 w-4 text-rose-400" />
  }

  const sortedSubmissions = [...submissions].sort((a, b) => b.composite_score - a.composite_score)
  const winningSubmission = sortedSubmissions[0]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{bidTitle}</h1>
          <p className="text-muted-foreground">RFP: {rfpNumber}</p>
          {currentStatus === 'awarded' && awardPackage && (
            <div className="mt-2 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium">
                Awarded to {winningSubmission?.vendor_name} - ${awardPackage.contract_value?.toLocaleString()}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          {currentStatus !== 'awarded' ? (
            <Dialog open={isAwardDialogOpen} onOpenChange={setIsAwardDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Trophy className="h-4 w-4 mr-2" />
                  Create Award
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Award Package</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Winning Submission</Label>
                    <select 
                      className="w-full mt-1 p-2 border rounded"
                      value={selectedSubmission}
                      onChange={(e) => setSelectedSubmission(e.target.value)}
                    >
                      <option value="">Select winning vendor...</option>
                      {sortedSubmissions.map((submission) => (
                        <option key={submission.id} value={submission.id}>
                          {submission.vendor_name} - ${submission.total_price.toLocaleString()} 
                          (Score: {submission.composite_score.toFixed(1)})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label>Contract Value</Label>
                    <Input
                      type="number"
                      value={awardForm.contract_value}
                      onChange={(e) => setAwardForm({...awardForm, contract_value: Number(e.target.value)})}
                      placeholder="Enter contract value"
                    />
                  </div>
                  
                  <div>
                    <Label>Selection Rationale</Label>
                    <Textarea
                      value={awardForm.selection_rationale}
                      onChange={(e) => setAwardForm({...awardForm, selection_rationale: e.target.value})}
                      placeholder="Explain why this vendor was selected..."
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label>Price Basis</Label>
                    <Textarea
                      value={awardForm.price_basis}
                      onChange={(e) => setAwardForm({...awardForm, price_basis: e.target.value})}
                      placeholder="Describe the pricing analysis and basis for award..."
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label>Funding Source</Label>
                    <Textarea
                      value={awardForm.funding_source}
                      onChange={(e) => setAwardForm({...awardForm, funding_source: e.target.value})}
                      placeholder="Specify funding source and budget details..."
                      rows={2}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleCreateAward} 
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? 'Creating Award...' : 'Create Award Package'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleDownloadMemo} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Memo
              </Button>
              <Button onClick={handleRegenerateMemo} variant="outline" disabled={loading}>
                <RefreshCw className="h-4 w-4 mr-2" />
                {loading ? 'Regenerating...' : 'Regenerate Memo'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Award Status Card */}
      {currentStatus === 'awarded' && awardPackage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-blue-500" />
              Award Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Contract Number</Label>
                <p className="font-medium">{awardPackage.contract_number}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Contract Value</Label>
                <p className="font-medium">${awardPackage.contract_value?.toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">DocuSign Status</Label>
                <div className="flex items-center gap-2">
                  {getStatusBadge(awardPackage.docusign_status)}
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Vendor Response</Label>
                <div className="flex items-center gap-2">
                  {getStatusBadge(awardPackage.vendor_acceptance_status)}
                </div>
              </div>
            </div>
            
            {awardPackage.award_memo_url && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Award Memo Generated
                    </span>
                    <span className="text-xs text-green-600">
                      {new Date(awardPackage.award_memo_generated_at).toLocaleString()}
                    </span>
                  </div>
                  <Button size="sm" variant="outline" onClick={handleDownloadMemo}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Side-by-side Final Scores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Final Scores Table */}
        <Card>
          <CardHeader>
            <CardTitle>Final Evaluation Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Technical</TableHead>
                  <TableHead>Commercial</TableHead>
                  <TableHead>Composite</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedSubmissions.map((submission, index) => (
                  <TableRow 
                    key={submission.id}
                    className="hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">
                      {index === 0 && <Trophy className="h-4 w-4 text-blue-500 inline mr-1" />}
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {submission.vendor_name}
                    </TableCell>
                    <TableCell>{submission.technical_score?.toFixed(1)}%</TableCell>
                    <TableCell>{submission.commercial_score?.toFixed(1)}%</TableCell>
                    <TableCell className="font-medium">
                      {submission.composite_score?.toFixed(1)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(submission.status)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Compliance Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Compliance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedSubmissions.map((submission) => (
                <div key={submission.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{submission.vendor_name}</h4>
                    <div className="text-sm text-muted-foreground">
                      ${submission.total_price.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      {getComplianceIcon(submission.compliance.bond_submitted)}
                      <span>Bond</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getComplianceIcon(submission.compliance.insurance_submitted)}
                      <span>Insurance</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getComplianceIcon(submission.compliance.prequalification_passed)}
                      <span>Prequalification</span>
                    </div>
                  </div>
                  
                  {submission.strengths?.length > 0 && (
                    <div className="mt-3">
                      <div className="text-xs font-medium text-green-700 mb-1">Strengths:</div>
                      <ul className="text-xs text-green-600 space-y-1">
                        {submission.strengths.slice(0, 2).map((strength, idx) => (
                          <li key={idx}>• {strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {submission.weaknesses?.length > 0 && (
                    <div className="mt-2">
                      <div className="text-xs font-medium text-red-700 mb-1">Concerns:</div>
                      <ul className="text-xs text-red-600 space-y-1">
                        {submission.weaknesses.slice(0, 2).map((weakness, idx) => (
                          <li key={idx}>• {weakness}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Tabs defaultValue="analysis" className="w-full">
        <TabsList>
          <TabsTrigger value="analysis">Detailed Analysis</TabsTrigger>
          <TabsTrigger value="pricing">Pricing Breakdown</TabsTrigger>
          <TabsTrigger value="timeline">Award Timeline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Technical Evaluation Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedSubmissions.slice(0, 3).map((submission) => (
                  <div key={submission.id} className="border-l-4 border-blue-200 pl-4">
                    <h4 className="font-medium">{submission.vendor_name}</h4>
                    <div className="text-sm text-muted-foreground mt-1">
                      Technical Score: {submission.technical_score?.toFixed(1)}% | 
                      Commercial Score: {submission.commercial_score?.toFixed(1)}%
                    </div>
                    {submission.strengths?.length > 0 && (
                      <div className="mt-2">
                        <div className="text-sm font-medium text-green-700">Key Strengths:</div>
                        <ul className="text-sm text-green-600 mt-1 space-y-1">
                          {submission.strengths.map((strength, idx) => (
                            <li key={idx}>• {strength}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {submission.weaknesses?.length > 0 && (
                      <div className="mt-2">
                        <div className="text-sm font-medium text-red-700">Areas of Concern:</div>
                        <ul className="text-sm text-red-600 mt-1 space-y-1">
                          {submission.weaknesses.map((weakness, idx) => (
                            <li key={idx}>• {weakness}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Price Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Base Price</TableHead>
                    <TableHead>Total Price</TableHead>
                    <TableHead>Variance from Lowest</TableHead>
                    <TableHead>Price Rank</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedSubmissions
                    .sort((a, b) => a.total_price - b.total_price)
                    .map((submission, index) => {
                      const lowestPrice = Math.min(...submissions.map(s => s.total_price))
                      const variance = ((submission.total_price - lowestPrice) / lowestPrice) * 100
                      
                      return (
                        <TableRow key={submission.id}>
                          <TableCell className="font-medium">
                            {submission.vendor_name}
                          </TableCell>
                          <TableCell>${(submission.total_price * 0.85).toLocaleString()}</TableCell>
                          <TableCell className="font-medium">
                            ${submission.total_price.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <span className={variance === 0 ? 'text-green-600' : variance < 5 ? 'text-yellow-600' : 'text-red-600'}>
                              +{variance.toFixed(1)}%
                            </span>
                          </TableCell>
                          <TableCell>{index + 1}</TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Award Process Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="font-medium">Evaluation Complete</div>
                    <div className="text-sm text-muted-foreground">All submissions scored and leveled</div>
                  </div>
                </div>
                
                {currentStatus === 'awarded' && (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <div className="font-medium">Award Package Created</div>
                        <div className="text-sm text-muted-foreground">
                          {awardPackage?.created_at && new Date(awardPackage.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    {awardPackage?.award_memo_generated_at && (
                      <div className="flex items-center gap-4">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div>
                          <div className="font-medium">Award Memo Generated</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(awardPackage.award_memo_generated_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
                
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    awardPackage?.docusign_status === 'completed' ? 'bg-green-500' : 
                    awardPackage?.docusign_status === 'sent' ? 'bg-blue-500' : 'bg-gray-300'
                  }`}></div>
                  <div>
                    <div className="font-medium">Contract Execution</div>
                    <div className="text-sm text-muted-foreground">
                      {awardPackage?.docusign_status === 'completed' ? 'Contract executed' : 'Pending vendor signature'}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

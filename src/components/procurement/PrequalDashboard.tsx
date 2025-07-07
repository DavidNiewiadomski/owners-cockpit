import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Clock, Shield, Plus, Filter, Search, Eye, FileText, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { prequalificationAPI } from '@/lib/api/prequalification';
import type { PrequalSummary } from '@/types/prequalification';
import { usePrequalifications } from '@/hooks/usePrequalification';
import WizardModal from '@/components/procurement/WizardModal';

const PrequalDashboard: React.FC = () => {
    const [companies, setCompanies] = useState<PrequalSummary[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<PrequalSummary | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        loadCompanies();
    }, []);

    const loadCompanies = async () => {
        try {
            setLoading(true);
            const { data } = await prequalificationAPI.getPrequalifications();
            setCompanies(data);
        } catch (error) {
            console.error('Failed to load companies:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderRiskIcon = (riskScore: number) => {
        if (riskScore <= 20) return <CheckCircle className="text-green-500" />;
        if (riskScore <= 40) return <Shield className="text-yellow-500" />;
        if (riskScore <= 60) return <AlertTriangle className="text-orange-500" />;
        return <AlertTriangle className="text-red-500" />;
    };

    const handleRowClick = (company: PrequalSummary) => {
        setSelectedCompany(company);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Vendor Prequalification</h1>
            {loading ? (
                <p>Loading companies...</p>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                Vendor Prequalifications
                            </span>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filter
                                </Button>
                                <Button size="sm">
                                    <Plus className="w-4 h-4 mr-2" />
                                    New Request
                                </Button>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Company Name</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Risk Score</TableHead>
                                    <TableHead>Expiry Countdown</TableHead>
                                    <TableHead>Documents</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {companies.map((company) => (
                                    <TableRow 
                                        key={company.id} 
                                        onClick={() => handleRowClick(company)} 
                                        className="cursor-pointer hover:bg-muted/50"
                                    >
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <FileText className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold">{company.company_name}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Submitted {company.submitted_at ? new Date(company.submitted_at).toLocaleDateString() : 'Not submitted'}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={company.status === 'approved' ? 'default' : 
                                                       company.status === 'pending' ? 'secondary' : 'destructive'}
                                                className={
                                                    company.status === 'approved'
                                                        ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                                        : company.status === 'pending'
                                                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                                                        : 'bg-red-100 text-red-700 hover:bg-red-100'
                                                }>
                                                {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
{renderRiskIcon(company.score || 0)}
                                                <span className="text-sm font-medium">{company.score || 'N/A'}</span>
                                                {(company.score || 0) < 60 && (
                                                    <Shield className={`w-4 h-4 ${
                                                        (company.score || 0) < 40 ? 'text-red-500' : 'text-orange-500'
                                                    }`} title={`Low scoring vendor (Score: ${company.score})`} />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {company.expiry_date ? (
                                                    <div className={`font-medium ${
                                                        Math.floor((new Date(company.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) < 30
                                                            ? 'text-red-600' : Math.floor((new Date(company.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) < 90
                                                            ? 'text-orange-600' : 'text-green-600'
                                                    }`}>
                                                        {Math.max(0, Math.floor((new Date(company.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">N/A</span>
                                                )}
                                                <div className="text-xs text-muted-foreground">
                                                    Expires {company.expiry_date ? new Date(company.expiry_date).toLocaleDateString() : 'N/A'}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <FileText className="w-4 h-4 text-blue-500" />
<span className="text-sm">{company.documents_uploaded || 0}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button variant="outline" size="sm">
                                                    Review
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {selectedCompany && (
                <WizardModal
                    company={selectedCompany}
                    onClose={() => setSelectedCompany(null)}
                    onApproved={() => loadCompanies()}
                />
            )}
        </div>
    );
};

export default PrequalDashboard;

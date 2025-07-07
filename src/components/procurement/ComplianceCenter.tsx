import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Shield,
  FileText,
  CheckCircle,
  AlertTriangle,
  InfoIcon,
  Bookmark,
  Upload,
  Download,
  Save,
  Plus,
  Search
} from 'lucide-react';

interface ComplianceItem {
  id: string;
  category: string;
  requirement: string;
  description: string;
  status: 'required' | 'optional';
  compliance: 'compliant' | 'non-compliant' | 'not-applicable';
  documents: string[];
  assignee?: string;
  dueDate?: string;
  notes?: string;
  severity: 'high' | 'medium' | 'low';
}

interface ComplianceCenterProps {
  onSave: (data: any) => void;
  initialData?: any;
}

export function ComplianceCenter({ onSave, initialData }: ComplianceCenterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([
    {
      id: '1',
      category: 'Bonding Requirements',
      requirement: 'Performance Bond',
      description: 'Contractor must provide a performance bond equal to 100% of the contract value',
      status: 'required',
      compliance: 'compliant',
      documents: ['bond_template.pdf'],
      severity: 'high'
    },
    {
      id: '2',
      category: 'Insurance',
      requirement: 'General Liability Insurance',
      description: 'Minimum coverage of $2 million per occurrence',
      status: 'required',
      compliance: 'compliant',
      documents: ['insurance_requirements.pdf'],
      severity: 'high'
    },
    {
      id: '3',
      category: 'Certifications',
      requirement: 'ISO 9001 Certification',
      description: 'Valid ISO 9001:2015 certification required',
      status: 'optional',
      compliance: 'not-applicable',
      documents: [],
      severity: 'medium'
    }
  ]);

  const categories = [
    'Bonding Requirements',
    'Insurance',
    'Certifications',
    'Safety Standards',
    'Environmental Compliance',
    'Quality Control',
    'Regulatory Permits',
    'Labor Requirements',
    'Financial Requirements',
    'Legal Requirements'
  ];

  const addComplianceItem = () => {
    const newItem: ComplianceItem = {
      id: String(complianceItems.length + 1),
      category: '',
      requirement: '',
      description: '',
      status: 'required',
      compliance: 'non-compliant',
      documents: [],
      severity: 'medium'
    };

    setComplianceItems([...complianceItems, newItem]);
  };

  const updateComplianceItem = (id: string, field: keyof ComplianceItem, value: any) => {
    setComplianceItems(items =>
      items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const removeComplianceItem = (id: string) => {
    setComplianceItems(items => items.filter(item => item.id !== id));
  };

  const handleSave = () => {
    onSave(complianceItems);
  };

  const getComplianceColor = (compliance: string) => {
    switch (compliance) {
      case 'compliant': return 'bg-green-100 text-green-700 border-green-200';
      case 'non-compliant': return 'bg-red-100 text-red-700 border-red-200';
      case 'not-applicable': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return '';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return '';
    }
  };

  const filteredItems = complianceItems.filter(item => {
    const matchesSearch = item.requirement.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const calculateComplianceScore = () => {
    const requiredItems = complianceItems.filter(item => item.status === 'required');
    if (requiredItems.length === 0) return 100;

    const compliantItems = requiredItems.filter(item => item.compliance === 'compliant');
    return Math.round((compliantItems.length / requiredItems.length) * 100);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Compliance Center</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Manage and track compliance requirements for the RFP
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Shield className="w-8 h-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{calculateComplianceScore()}%</div>
                <div className="text-sm text-muted-foreground">Compliance Score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">
                  {complianceItems.filter(item => item.compliance === 'non-compliant').length}
                </div>
                <div className="text-sm text-muted-foreground">Non-Compliant Items</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <FileText className="w-8 h-8 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">
                  {complianceItems.filter(item => item.status === 'required').length}
                </div>
                <div className="text-sm text-muted-foreground">Required Items</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Bookmark className="w-8 h-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold">
                  {complianceItems.filter(item => item.severity === 'high').length}
                </div>
                <div className="text-sm text-muted-foreground">High Priority</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search requirements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addComplianceItem}>
              <Plus className="w-4 h-4 mr-2" />
              Add Requirement
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Items */}
      <div className="space-y-4">
        {filteredItems.map(item => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label>Requirement</Label>
                    <Input
                      value={item.requirement}
                      onChange={(e) => updateComplianceItem(item.id, 'requirement', e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                  <div className="w-[200px]">
                    <Label>Category</Label>
                    <Select
                      value={item.category}
                      onValueChange={(value) => updateComplianceItem(item.id, 'category', value)}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-[150px]">
                    <Label>Status</Label>
                    <Select
                      value={item.status}
                      onValueChange={(value: 'required' | 'optional') =>
                        updateComplianceItem(item.id, 'status', value)
                      }
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="required">Required</SelectItem>
                        <SelectItem value="optional">Optional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-[150px]">
                    <Label>Severity</Label>
                    <Select
                      value={item.severity}
                      onValueChange={(value: 'high' | 'medium' | 'low') =>
                        updateComplianceItem(item.id, 'severity', value)
                      }
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={item.description}
                    onChange={(e) => updateComplianceItem(item.id, 'description', e.target.value)}
                    className="mt-1.5"
                    rows={2}
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label>Compliance Status</Label>
                    <Select
                      value={item.compliance}
                      onValueChange={(value: 'compliant' | 'non-compliant' | 'not-applicable') =>
                        updateComplianceItem(item.id, 'compliance', value)
                      }
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compliant">Compliant</SelectItem>
                        <SelectItem value="non-compliant">Non-Compliant</SelectItem>
                        <SelectItem value="not-applicable">Not Applicable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Label>Documents</Label>
                    <div className="mt-1.5 flex items-center gap-2">
                      <Button variant="outline">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Document
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1">
                    <Label>Assignee</Label>
                    <Input
                      value={item.assignee}
                      onChange={(e) => updateComplianceItem(item.id, 'assignee', e.target.value)}
                      placeholder="Responsible person"
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Badge variant="outline" className={getComplianceColor(item.compliance)}>
                      {item.compliance}
                    </Badge>
                    <Badge variant="outline" className={getSeverityColor(item.severity)}>
                      {item.severity} priority
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeComplianceItem(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Requirements
        </Button>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Requirements
        </Button>
      </div>
    </div>
  );
}

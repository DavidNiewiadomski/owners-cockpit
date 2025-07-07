import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DollarSign,
  Plus,
  Trash2,
  Calculator,
  TrendingUp,
  AlertTriangle,
  PieChart,
  BarChart3,
  Download,
  Upload,
  FileSpreadsheet,
  Target,
  Settings,
  Zap,
} from 'lucide-react';
import type { BudgetData, BudgetLineItem } from '@/types/rfp';

interface BudgetPlanningProps {
  onSave: (budgetData: BudgetData) => void;
  initialData?: BudgetData;
}

export function BudgetPlanning({ onSave, initialData }: BudgetPlanningProps) {
  const [budgetData, setBudgetData] = useState<BudgetData>(
    initialData || {
      totalBudget: 0,
      contingency: 0,
      contingencyPercentage: 10,
      lineItems: [],
      categories: {},
    }
  );
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState('line-items');

  // Budget categories
  const categories = [
    'Site Work',
    'Structural',
    'MEP',
    'Finishes',
    'Equipment',
    'General Conditions',
    'Overhead & Profit',
    'Other',
  ];

  // Calculate budget metrics
  const metrics = useMemo(() => {
    const lineItemsTotal = budgetData.lineItems.reduce(
      (sum, item) => sum + item.totalCost,
      0
    );
    const contingencyAmount = (lineItemsTotal * budgetData.contingencyPercentage) / 100;
    const totalWithContingency = lineItemsTotal + contingencyAmount;
    const budgetVariance = budgetData.totalBudget - totalWithContingency;
    const utilizationPercentage = budgetData.totalBudget > 0 
      ? (totalWithContingency / budgetData.totalBudget) * 100 
      : 0;

    // Category breakdown
    const categoryTotals = budgetData.lineItems.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.totalCost;
      return acc;
    }, {} as Record<string, number>);

    return {
      lineItemsTotal,
      contingencyAmount,
      totalWithContingency,
      budgetVariance,
      utilizationPercentage,
      categoryTotals,
      isOverBudget: budgetVariance < 0,
    };
  }, [budgetData]);

  const addLineItem = () => {
    const newItem: BudgetLineItem = {
      id: String(Date.now()),
      description: '',
      quantity: 1,
      unit: 'Each',
      unitCost: 0,
      totalCost: 0,
      category: 'Other',
    };
    setBudgetData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, newItem],
    }));
  };

  const updateLineItem = (id: string, updates: Partial<BudgetLineItem>) => {
    setBudgetData(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item => {
        if (item.id === id) {
          const updated = { ...item, ...updates };
          // Recalculate total cost
          updated.totalCost = updated.quantity * updated.unitCost;
          return updated;
        }
        return item;
      }),
    }));
  };

  const deleteLineItem = (id: string) => {
    setBudgetData(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter(item => item.id !== id),
    }));
  };

  const handleTotalBudgetChange = (value: string) => {
    setBudgetData(prev => ({
      ...prev,
      totalBudget: parseFloat(value) || 0,
    }));
  };

  const handleContingencyChange = (value: string) => {
    setBudgetData(prev => ({
      ...prev,
      contingencyPercentage: parseFloat(value) || 0,
    }));
  };

  const handleAIOptimize = async () => {
    setIsCalculating(true);
    // Simulate AI optimization
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsCalculating(false);
  };

  const handleSave = () => {
    onSave(budgetData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Budget Planning</h3>
        <p className="text-sm text-muted-foreground">
          Define project budget with detailed cost breakdown and AI-powered optimization
        </p>
      </div>

      {/* Budget Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Budget Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="space-y-2">
              <Label>Total Budget</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="number"
                  placeholder="0"
                  value={budgetData.totalBudget}
                  onChange={(e) => handleTotalBudgetChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Line Items Total</Label>
              <div className="text-2xl font-semibold">
                ${metrics.lineItemsTotal.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">
                {budgetData.lineItems.length} items
              </p>
            </div>
            <div className="space-y-2">
              <Label>Contingency ({budgetData.contingencyPercentage}%)</Label>
              <div className="text-2xl font-semibold">
                ${metrics.contingencyAmount.toLocaleString()}
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={budgetData.contingencyPercentage}
                  onChange={(e) => handleContingencyChange(e.target.value)}
                  className="w-20 h-8 text-sm"
                  min="0"
                  max="50"
                />
                <span className="text-sm">%</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Budget Variance</Label>
              <div className={`text-2xl font-semibold ${metrics.isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                ${Math.abs(metrics.budgetVariance).toLocaleString()}
              </div>
              <Badge className={metrics.isOverBudget ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}>
                {metrics.isOverBudget ? 'Over Budget' : 'Under Budget'}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Budget Utilization</span>
              <span>{metrics.utilizationPercentage.toFixed(1)}%</span>
            </div>
            <Progress 
              value={Math.min(metrics.utilizationPercentage, 100)} 
              className={`h-3 ${metrics.utilizationPercentage > 100 ? 'bg-red-100' : ''}`}
            />
            {metrics.utilizationPercentage > 100 && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertTriangle className="w-4 h-4" />
                Budget exceeded by {(metrics.utilizationPercentage - 100).toFixed(1)}%
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-[400px]">
          <TabsTrigger value="line-items">Line Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="line-items" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Budget Line Items</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleAIOptimize} disabled={isCalculating}>
                    <Zap className="w-4 h-4 mr-2" />
                    {isCalculating ? 'Optimizing...' : 'AI Optimize'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Import CSV
                  </Button>
                  <Button size="sm" onClick={addLineItem}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgetData.lineItems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No budget items yet. Add your first line item to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground border-b pb-2">
                      <div className="col-span-3">Description</div>
                      <div className="col-span-2">Category</div>
                      <div className="col-span-1">Quantity</div>
                      <div className="col-span-2">Unit</div>
                      <div className="col-span-2">Unit Cost</div>
                      <div className="col-span-2">Total Cost</div>
                      <div className="col-span-1"></div>
                    </div>
                    {budgetData.lineItems.map((item) => (
                      <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-3">
                          <Input
                            placeholder="Item description"
                            value={item.description}
                            onChange={(e) => updateLineItem(item.id, { description: e.target.value })}
                          />
                        </div>
                        <div className="col-span-2">
                          <Select
                            value={item.category}
                            onValueChange={(value) => updateLineItem(item.id, { category: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-1">
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateLineItem(item.id, { quantity: parseFloat(e.target.value) || 0 })}
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            placeholder="Each"
                            value={item.unit}
                            onChange={(e) => updateLineItem(item.id, { unit: e.target.value })}
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            value={item.unitCost}
                            onChange={(e) => updateLineItem(item.id, { unitCost: parseFloat(e.target.value) || 0 })}
                          />
                        </div>
                        <div className="col-span-2">
                          <div className="text-right font-medium">
                            ${item.totalCost.toLocaleString()}
                          </div>
                        </div>
                        <div className="col-span-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteLineItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Category Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.map((category) => {
                  const total = metrics.categoryTotals[category] || 0;
                  const percentage = metrics.lineItemsTotal > 0 
                    ? (total / metrics.lineItemsTotal) * 100 
                    : 0;
                  
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{category}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {percentage.toFixed(1)}%
                          </span>
                          <span className="font-medium">
                            ${total.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="mt-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Budget Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Project Cost</span>
                    <span className="font-medium">${metrics.totalWithContingency.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cost per Category</span>
                    <span className="font-medium">{Object.keys(metrics.categoryTotals).length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Average Item Cost</span>
                    <span className="font-medium">
                      ${budgetData.lineItems.length > 0 
                        ? (metrics.lineItemsTotal / budgetData.lineItems.length).toLocaleString() 
                        : '0'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Largest Category</span>
                    <span className="font-medium">
                      {Object.entries(metrics.categoryTotals).length > 0
                        ? Object.entries(metrics.categoryTotals).reduce((a, b) => a[1] > b[1] ? a : b)[0]
                        : 'None'}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Recommendations</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {metrics.isOverBudget && (
                      <div className="flex items-start gap-2 text-red-600">
                        <AlertTriangle className="w-4 h-4 mt-0.5" />
                        <span>Consider reducing scope or increasing budget to stay within target.</span>
                      </div>
                    )}
                    {budgetData.contingencyPercentage < 5 && (
                      <div className="flex items-start gap-2 text-orange-600">
                        <AlertTriangle className="w-4 h-4 mt-0.5" />
                        <span>Contingency percentage seems low for construction projects (typically 10-20%).</span>
                      </div>
                    )}
                    {budgetData.lineItems.length < 5 && (
                      <div className="flex items-start gap-2 text-blue-600">
                        <Target className="w-4 h-4 mt-0.5" />
                        <span>Consider adding more detailed line items for better cost control.</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Export & Reporting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Export Budget to Excel
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Generate Cost Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Budget Template
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Budget Summary</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Base Cost:</span>
                      <span>${metrics.lineItemsTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Contingency:</span>
                      <span>${metrics.contingencyAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-1">
                      <span>Total:</span>
                      <span>${metrics.totalWithContingency.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          Save Budget
        </Button>
      </div>
    </div>
  );
}

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/router';
import {
  BarChart3,
  FileSpreadsheet,
  Upload,
  Settings,
  CheckCircle,
  ArrowRight,
  Zap,
  Target,
  Users,
  DollarSign
} from 'lucide-react';

export default function DemoIndexPage() {
  const router = useRouter();

  const demos = [
    {
      title: 'Bid Analysis System',
      description: 'Complete bid upload, processing, and manual leveling system with advanced editing capabilities',
      path: '/demo/bid-analysis',
      icon: BarChart3,
      features: [
        'File upload & import (Excel, PDF, CSV)',
        'Manual bid leveling with real-time editing',
        'Bulk editing tools & advanced controls',
        'Vendor management & line item operations',
        'Export capabilities & change tracking'
      ],
      status: 'Complete',
      statusColor: 'bg-green-100 text-green-700'
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Owners Cockpit Demo Center</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the full capabilities of our AI-first Design-Bid-Build control tower with these interactive demonstrations
          </p>
        </div>

        {/* Technology Stack */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Technology Stack
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="font-semibold">Frontend</div>
                <div className="text-sm text-muted-foreground">Next.js 14 • Tailwind 3.4</div>
              </div>
              <div>
                <div className="font-semibold">Backend</div>
                <div className="text-sm text-muted-foreground">Supabase 2.38 • Postgres 15</div>
              </div>
              <div>
                <div className="font-semibold">AI/ML</div>
                <div className="text-sm text-muted-foreground">GPT-4o • Claude-3 • Gemini-1.5</div>
              </div>
              <div>
                <div className="font-semibold">Voice</div>
                <div className="text-sm text-muted-foreground">ElevenLabs STT/TTS</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Cards */}
        <div className="grid gap-6">
          {demos.map((demo, index) => {
            const Icon = demo.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{demo.title}</CardTitle>
                        <p className="text-muted-foreground">{demo.description}</p>
                      </div>
                    </div>
                    <Badge className={demo.statusColor}>
                      {demo.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Key Features:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {demo.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>Multi-vendor support</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>Real-time calculations</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        <span>Enterprise-ready</span>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => router.push(demo.path)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Launch Demo
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Access */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={() => router.push('/demo/bid-analysis')}
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <Upload className="w-8 h-8" />
                <div className="text-center">
                  <div className="font-medium">Bid Upload</div>
                  <div className="text-xs text-muted-foreground">Import & process bids</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => router.push('/demo/bid-analysis?tab=analysis')}
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <FileSpreadsheet className="w-8 h-8" />
                <div className="text-center">
                  <div className="font-medium">Manual Leveling</div>
                  <div className="text-xs text-muted-foreground">Edit bids manually</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => router.push('/demo/bid-analysis?advanced=true')}
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <Settings className="w-8 h-8" />
                <div className="text-center">
                  <div className="font-medium">Advanced Tools</div>
                  <div className="text-xs text-muted-foreground">Bulk editing & management</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground py-8">
          <p>Built with Next.js, Supabase, and AI integration • Enterprise-grade architecture</p>
        </div>
      </div>
    </div>
  );
}

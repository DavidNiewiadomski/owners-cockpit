
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Calendar, AlertTriangle, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';

interface ExecutiveDashboardProps {
  projectId: string;
}

const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({ projectId }) => {
  // Mock data - in real implementation, this would come from API
  const portfolioMetrics = {
    totalProjects: 12,
    activeProjects: 8,
    totalBudget: 15000000,
    spentBudget: 11250000,
    onTimeProjects: 6,
    scheduledCompletion: '2024-Q3'
  };

  const projectData = [
    { name: 'Office Complex A', budget: 2500000, spent: 1875000, progress: 75 },
    { name: 'Retail Center B', budget: 1800000, spent: 1260000, progress: 70 },
    { name: 'Mixed Use C', budget: 3200000, spent: 2240000, progress: 65 },
    { name: 'Warehouse D', budget: 1500000, spent: 1200000, progress: 80 }
  ];

  const riskData = [
    { category: 'Schedule', value: 3, color: '#f59e0b' },
    { category: 'Budget', value: 2, color: '#ef4444' },
    { category: 'Safety', value: 1, color: '#10b981' },
    { category: 'Quality', value: 2, color: '#3b82f6' }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel rounded-xl p-3 shadow-2xl border border-cyan-500/30">
          <p className="text-cyan-300 font-futuristic text-sm">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-white font-mono">
              <span className="inline-block w-3 h-3 rounded-full mr-2 animate-glow" style={{ backgroundColor: entry.color }} />
              {`${entry.dataKey}: $${(entry.value / 1000000).toFixed(1)}M`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* AI Insights - enhanced futuristic styling */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="futuristic-card glow-border">
          <div className="absolute inset-0 holographic-bg opacity-20" />
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <AlertTriangle className="h-6 w-6 text-amber-400 animate-glow" />
              </motion.div>
              <span className="font-futuristic text-xl tracking-wide neon-text">AI Executive Summary</span>
              <div className="ml-auto w-16 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-shimmer" />
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-4">
              {[
                { 
                  variant: "destructive" as const, 
                  title: "Office Complex A Budget Alert", 
                  desc: "Project is 75% complete but has used 83% of budget. Recommend immediate cost review.",
                  icon: "🚨"
                },
                { 
                  variant: "default" as const, 
                  title: "Q3 Portfolio Performance", 
                  desc: "6 of 8 active projects are on schedule. Overall portfolio ROI projected at 14.2%.",
                  icon: "📊"
                },
                { 
                  variant: "secondary" as const, 
                  title: "Sustainability Investment", 
                  desc: "Solar installation across 3 properties could reduce operational costs by $180K annually.",
                  icon: "💡"
                }
              ].map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-start gap-4 p-3 rounded-lg glass-panel"
                >
                  <Badge variant={insight.variant} className="status-badge">
                    {insight.variant === "destructive" ? "High Priority" : 
                     insight.variant === "default" ? "Medium Priority" : "Opportunity"}
                  </Badge>
                  <div className="flex-1">
                    <h4 className="font-medium text-white flex items-center gap-2">
                      <span>{insight.icon}</span>
                      {insight.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">{insight.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Portfolio Value",
            icon: DollarSign,
            value: `$${(portfolioMetrics.totalBudget / 1000000).toFixed(1)}M`,
            trend: "+12% from last quarter",
            color: "text-green-400"
          },
          {
            title: "Budget Utilization",
            icon: TrendingUp,
            value: `${Math.round((portfolioMetrics.spentBudget / portfolioMetrics.totalBudget) * 100)}%`,
            trend: `$${(portfolioMetrics.spentBudget / 1000000).toFixed(1)}M spent`,
            color: "text-blue-400"
          },
          {
            title: "Active Projects",
            icon: Users,
            value: portfolioMetrics.activeProjects.toString(),
            trend: `${portfolioMetrics.onTimeProjects} on schedule`,
            color: "text-purple-400"
          },
          {
            title: "Portfolio Timeline",
            icon: Calendar,
            value: portfolioMetrics.scheduledCompletion,
            trend: "Expected completion",
            color: "text-cyan-400"
          }
        ].map((kpi, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            <Card className="futuristic-card glow-border group hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-0 holographic-bg opacity-10 group-hover:opacity-20 transition-opacity" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-futuristic text-muted-foreground">{kpi.title}</CardTitle>
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <kpi.icon className={`h-5 w-5 ${kpi.color} animate-glow`} />
                </motion.div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className={`text-3xl font-bold font-futuristic ${kpi.color}`}>{kpi.value}</div>
                {index === 1 && (
                  <div className="mt-2">
                    <div className="w-full bg-muted/20 rounded-full h-2 futuristic-progress">
                      <motion.div 
                        className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400"
                        initial={{ width: 0 }}
                        animate={{ width: "75%" }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                      />
                    </div>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-2 font-mono">
                  {kpi.trend}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Enhanced Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="futuristic-card glow-border">
            <div className="absolute inset-0 holographic-bg opacity-10" />
            <CardHeader className="relative z-10">
              <CardTitle className="font-futuristic text-cyan-100 flex items-center gap-3">
                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-glow" />
                Project Budget Performance
                <div className="ml-auto w-12 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={projectData}>
                  <defs>
                    <linearGradient id="budgetGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#e2e8f0" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#e2e8f0" stopOpacity={0.3} />
                    </linearGradient>
                    <linearGradient id="spentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.4} />
                    </linearGradient>
                    <filter id="barGlow">
                      <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#06b6d4" floodOpacity="0.6"/>
                    </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="2 4" stroke="rgba(6, 182, 212, 0.2)" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80}
                    tick={{ fill: '#94a3b8', fontFamily: 'JetBrains Mono', fontSize: 10 }}
                  />
                  <YAxis tick={{ fill: '#94a3b8', fontFamily: 'JetBrains Mono', fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="budget" fill="url(#budgetGradient)" name="Budget" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="spent" fill="url(#spentGradient)" name="Spent" radius={[4, 4, 0, 0]} filter="url(#barGlow)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
        >
          <Card className="futuristic-card glow-border">
            <div className="absolute inset-0 holographic-bg opacity-10" />
            <CardHeader className="relative z-10">
              <CardTitle className="font-futuristic text-purple-100 flex items-center gap-3">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-glow" />
                Risk Distribution
                <div className="ml-auto w-12 h-0.5 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full" />
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <defs>
                    {riskData.map((entry, index) => (
                      <radialGradient key={index} id={`riskGradient${index}`} cx="0.5" cy="0.3" r="0.8">
                        <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                        <stop offset="100%" stopColor={entry.color} stopOpacity={0.4} />
                      </radialGradient>
                    ))}
                  </defs>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={40}
                    dataKey="value"
                    label={({ category, value }) => `${category}: ${value}`}
                    labelLine={false}
                  >
                    {riskData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={`url(#riskGradient${index})`}
                        stroke={entry.color}
                        strokeWidth={1}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0];
                        return (
                          <div className="glass-panel rounded-xl p-3 shadow-2xl border border-purple-500/30">
                            <p className="text-purple-300 font-futuristic">{data.name}</p>
                            <p className="text-white font-mono">Value: {data.value}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;

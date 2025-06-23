
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { motion } from 'framer-motion';

interface BarChartCardProps {
  title: string;
  data: any[];
  xKey: string;
  yKeys: string[];
  colors: string[];
  className?: string;
}

const BarChartCard: React.FC<BarChartCardProps> = ({
  title,
  data,
  xKey,
  yKeys,
  colors,
  className
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 backdrop-blur-md border border-cyan-500/30 rounded-lg p-3 shadow-2xl">
          <p className="text-cyan-300 font-mono text-sm">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-white font-medium">
              <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
              {`${entry.dataKey}: ${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-xl border border-cyan-500/20 shadow-2xl shadow-cyan-500/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent" />
        
        <CardHeader className="relative">
          <CardTitle className="text-cyan-100 font-mono tracking-wide text-lg flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            {title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="relative">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  {colors.map((color, index) => (
                    <linearGradient key={index} id={`barGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                      <stop offset="50%" stopColor={color} stopOpacity={0.6} />
                      <stop offset="100%" stopColor={color} stopOpacity={0.2} />
                    </linearGradient>
                  ))}
                  <filter id="glow">
                    <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#06b6d4" floodOpacity="0.3"/>
                  </filter>
                </defs>
                
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="rgba(6, 182, 212, 0.1)" 
                  strokeWidth={1}
                />
                
                <XAxis 
                  dataKey={xKey} 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }}
                />
                
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }}
                />
                
                <Tooltip content={<CustomTooltip />} />
                
                {yKeys.map((key, index) => (
                  <Bar 
                    key={key}
                    dataKey={key} 
                    fill={`url(#barGradient${index})`}
                    radius={[4, 4, 0, 0]}
                    filter="url(#glow)"
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-lg border border-cyan-500/20 pointer-events-none">
            <div className="absolute inset-0 rounded-lg border border-cyan-400/10 animate-pulse" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BarChartCard;

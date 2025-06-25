
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface BarChartCardProps {
  title: string;
  data: Record<string, unknown>[];
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
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ color: string; dataKey: string; value: number }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel rounded-xl p-4 shadow-2xl border border-cyan-500/30"
        >
          <p className="text-cyan-300 font-futuristic text-sm font-medium mb-2">{`${label}`}</p>
          {payload.map((entry, index: number) => (
            <motion.p 
              key={index} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-white font-medium flex items-center gap-3"
            >
              <span 
                className="inline-block w-3 h-3 rounded-full animate-glow" 
                style={{ backgroundColor: entry.color, boxShadow: `0 0 10px ${entry.color}` }} 
              />
              <span className="font-mono">{`${entry.dataKey}: ${entry.value.toLocaleString()}`}</span>
            </motion.p>
          ))}
        </motion.div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      <Card className="futuristic-card glow-border overflow-hidden">
        <div className="absolute inset-0 holographic-bg opacity-30" />
        <div className="absolute inset-0 data-grid opacity-20" />
        
        <CardHeader className="relative z-10">
          <CardTitle className="text-cyan-100 font-futuristic tracking-wide text-lg flex items-center gap-3">
            <motion.div 
              className="w-3 h-3 bg-cyan-400 rounded-full animate-glow"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {title}
            <div className="ml-auto w-12 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full" />
          </CardTitle>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <div className="h-80 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent rounded-lg" />
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  {colors.map((color, index) => (
                    <React.Fragment key={index}>
                      <linearGradient id={`barGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                        <stop offset="50%" stopColor={color} stopOpacity={0.7} />
                        <stop offset="100%" stopColor={color} stopOpacity={0.3} />
                      </linearGradient>
                      <filter id={`barGlow${index}`}>
                        <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={color} floodOpacity="0.6"/>
                        <feDropShadow dx="0" dy="2" stdDeviation="8" floodColor={color} floodOpacity="0.3"/>
                      </filter>
                    </React.Fragment>
                  ))}
                  <filter id="gridGlow">
                    <feDropShadow dx="0" dy="0" stdDeviation="1" floodColor="#06b6d4" floodOpacity="0.4"/>
                  </filter>
                </defs>
                
                <CartesianGrid 
                  strokeDasharray="2 4" 
                  stroke="rgba(6, 182, 212, 0.2)" 
                  strokeWidth={1}
                  filter="url(#gridGlow)"
                />
                
                <XAxis 
                  dataKey={xKey} 
                  axisLine={false}
                  tickLine={false}
                  tick={{ 
                    fill: '#94a3b8', 
                    fontSize: 11, 
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: 500
                  }}
                />
                
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ 
                    fill: '#94a3b8', 
                    fontSize: 11, 
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: 500
                  }}
                  tickFormatter={(value) => `${(value / 1000)}K`}
                />
                
                <Tooltip content={<CustomTooltip />} />
                
                {yKeys.map((key, index) => (
                  <Bar 
                    key={key}
                    dataKey={key} 
                    fill={`url(#barGradient${index})`}
                    radius={[6, 6, 0, 0]}
                    filter={`url(#barGlow${index})`}
                    stroke={colors[index]}
                    strokeWidth={0.5}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Enhanced animated border effects */}
          <div className="absolute inset-0 rounded-lg border border-cyan-500/10 pointer-events-none">
            <motion.div 
              className="absolute inset-0 rounded-lg border border-cyan-400/20"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BarChartCard;

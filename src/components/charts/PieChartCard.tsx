
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';

interface PieChartCardProps {
  title: string;
  data: any[];
  colors: string[];
  className?: string;
}

const PieChartCard: React.FC<PieChartCardProps> = ({
  title,
  data,
  colors,
  className
}) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-black/90 backdrop-blur-md border border-purple-500/30 rounded-lg p-3 shadow-2xl">
          <p className="text-purple-300 font-mono text-sm">{data.name}</p>
          <p className="text-white font-medium">
            Value: {data.value.toLocaleString()}
          </p>
          <p className="text-purple-200 text-sm">
            {((data.value / data.payload.total) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="font-mono text-sm font-bold"
        filter="url(#textGlow)"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, rotate: -10 }}
      animate={{ opacity: 1, rotate: 0 }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      <Card className="bg-gradient-to-br from-purple-900/80 to-indigo-900/60 backdrop-blur-xl border border-purple-500/20 shadow-2xl shadow-purple-500/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent" />
        
        <CardHeader className="relative">
          <CardTitle className="text-purple-100 font-mono tracking-wide text-lg flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            {title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="relative">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  {colors.map((color, index) => (
                    <radialGradient key={index} id={`pieGradient${index}`} cx="0.5" cy="0.5" r="0.8">
                      <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                      <stop offset="70%" stopColor={color} stopOpacity={0.7} />
                      <stop offset="100%" stopColor={color} stopOpacity={0.3} />
                    </radialGradient>
                  ))}
                  <filter id="pieGlow">
                    <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#a855f7" floodOpacity="0.4"/>
                  </filter>
                  <filter id="textGlow">
                    <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#ffffff" floodOpacity="0.8"/>
                  </filter>
                </defs>
                
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={<CustomLabel />}
                  outerRadius={100}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="rgba(168, 85, 247, 0.3)"
                  strokeWidth={2}
                  filter="url(#pieGlow)"
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`url(#pieGradient${index % colors.length})`}
                    />
                  ))}
                </Pie>
                
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-lg border border-purple-500/20 pointer-events-none">
            <div className="absolute inset-0 rounded-lg border border-purple-400/10 animate-pulse" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PieChartCard;


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
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotateY: -10 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          className="glass-panel rounded-xl p-4 shadow-2xl border border-purple-500/30"
        >
          <p className="text-purple-300 font-futuristic text-sm font-medium">{data.name}</p>
          <p className="text-white font-mono font-bold text-lg">
            {data.value.toLocaleString()}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <div 
              className="w-3 h-3 rounded-full animate-glow"
              style={{ 
                backgroundColor: data.color,
                boxShadow: `0 0 15px ${data.color}`
              }}
            />
            <p className="text-purple-200 text-sm font-mono">
              {((data.value / data.payload.total) * 100).toFixed(1)}%
            </p>
          </div>
        </motion.div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <motion.text 
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.2 }}
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="font-futuristic text-sm font-bold"
        filter="url(#textGlow)"
        style={{
          textShadow: '0 0 10px rgba(255,255,255,0.8)'
        }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </motion.text>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, rotateY: -15 }}
      animate={{ opacity: 1, rotateY: 0 }}
      transition={{ duration: 0.8 }}
      className={className}
    >
      <Card className="futuristic-card glow-border overflow-hidden">
        <div className="absolute inset-0 holographic-bg opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20" />
        
        <CardHeader className="relative z-10">
          <CardTitle className="text-purple-100 font-futuristic tracking-wide text-lg flex items-center gap-3">
            <motion.div 
              className="w-3 h-3 bg-purple-400 rounded-full animate-glow"
              animate={{ 
                scale: [1, 1.3, 1],
                rotate: [0, 360]
              }}
              transition={{ 
                scale: { duration: 2, repeat: Infinity },
                rotate: { duration: 8, repeat: Infinity, ease: "linear" }
              }}
            />
            {title}
            <div className="ml-auto w-12 h-0.5 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full" />
          </CardTitle>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <div className="h-80 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 to-transparent rounded-lg" />
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  {colors.map((color, index) => (
                    <React.Fragment key={index}>
                      <radialGradient id={`pieGradient${index}`} cx="0.5" cy="0.3" r="0.8">
                        <stop offset="0%" stopColor={color} stopOpacity={1} />
                        <stop offset="50%" stopColor={color} stopOpacity={0.8} />
                        <stop offset="100%" stopColor={color} stopOpacity={0.4} />
                      </radialGradient>
                      <filter id={`pieGlow${index}`}>
                        <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor={color} floodOpacity="0.6"/>
                        <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor={color} floodOpacity="0.3"/>
                      </filter>
                    </React.Fragment>
                  ))}
                  <filter id="textGlow">
                    <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#ffffff" floodOpacity="0.8"/>
                  </filter>
                </defs>
                
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={CustomLabel}
                  outerRadius={110}
                  innerRadius={45}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth={2}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`url(#pieGradient${index % colors.length})`}
                      filter={`url(#pieGlow${index % colors.length})`}
                    />
                  ))}
                </Pie>
                
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Enhanced floating particles effect */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-60"
                style={{
                  left: `${20 + (i * 12)}%`,
                  top: `${30 + (i * 8)}%`,
                }}
                animate={{
                  y: [-10, 10, -10],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 3 + (i * 0.5),
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
          
          {/* Enhanced border glow */}
          <div className="absolute inset-0 rounded-lg border border-purple-500/10 pointer-events-none">
            <motion.div 
              className="absolute inset-0 rounded-lg border border-purple-400/20"
              animate={{ 
                opacity: [0.2, 0.6, 0.2],
                scale: [1, 1.02, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PieChartCard;


import React from 'react';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface SparkBarProps {
  data: Array<{value: number}>
  color: string;
  className?: string;
}

const SparkBar: React.FC<SparkBarProps> = ({ data, color, className }) => {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className={`h-12 relative overflow-hidden ${className}`}
    >
      {/* Background glow effect */}
      <div 
        className="absolute inset-0 rounded-md opacity-20"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}20, transparent)`,
        }}
      />
      
      {/* Data grid overlay */}
      <div className="absolute inset-0 data-grid opacity-30" />
      
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <defs>
            <linearGradient id={`sparkGradient-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={1} />
              <stop offset="30%" stopColor={color} stopOpacity={0.8} />
              <stop offset="100%" stopColor={color} stopOpacity={0.2} />
            </linearGradient>
            <filter id={`sparkGlow-${color}`}>
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={color} floodOpacity="0.8"/>
              <feDropShadow dx="0" dy="1" stdDeviation="6" floodColor={color} floodOpacity="0.4"/>
            </filter>
            <filter id="shimmerEffect">
              <feFlood floodColor="rgba(255,255,255,0.3)" />
              <feComposite in="SourceGraphic" operator="over" />
            </filter>
          </defs>
          <Bar 
            dataKey="value" 
            fill={`url(#sparkGradient-${color})`}
            radius={[3, 3, 1, 1]}
            filter={`url(#sparkGlow-${color})`}
            stroke={color}
            strokeWidth={0.5}
          />
        </BarChart>
      </ResponsiveContainer>
      
      {/* Animated shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "linear"
        }}
      />
      
      {/* Border glow */}
      <div 
        className="absolute inset-0 rounded-md border border-opacity-40"
        style={{ borderColor: color }}
      />
    </motion.div>
  );
};

export default SparkBar;

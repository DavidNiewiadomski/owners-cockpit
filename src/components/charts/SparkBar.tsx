
import React from 'react';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface SparkBarProps {
  data: any[];
  color: string;
  className?: string;
}

const SparkBar: React.FC<SparkBarProps> = ({ data, color, className }) => {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`h-12 ${className}`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <defs>
            <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.8} />
              <stop offset="100%" stopColor={color} stopOpacity={0.2} />
            </linearGradient>
            <filter id="sparkGlow">
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor={color} floodOpacity="0.6"/>
            </filter>
          </defs>
          <Bar 
            dataKey="value" 
            fill="url(#sparkGradient)"
            radius={[2, 2, 0, 0]}
            filter="url(#sparkGlow)"
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default SparkBar;

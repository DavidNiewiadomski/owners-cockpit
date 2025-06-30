import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const SimpleDataTest: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [financials, setFinancials] = useState<any[]>([]);
  const [status, setStatus] = useState<string>('Loading...');

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔥 TESTING DIRECT CONNECTION');
        
        // Test 1: Fetch projects
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*');
        
        if (projectError) {
          console.error('❌ Project fetch error:', projectError);
          setStatus('FAILED: ' + projectError.message);
          return;
        }

        console.log('✅ Projects fetched:', projectData);
        setProjects(projectData || []);

        // Test 2: Fetch financial metrics
        const { data: financialData, error: financialError } = await supabase
          .from('project_financial_metrics')
          .select('*');
          
        if (financialError) {
          console.error('❌ Financial fetch error:', financialError);
          setStatus('FAILED: ' + financialError.message);
          return;
        }

        console.log('✅ Financials fetched:', financialData);
        setFinancials(financialData || []);
        
        setStatus('SUCCESS');
        
      } catch (err) {
        console.error('❌ Unexpected error:', err);
        setStatus('FAILED: ' + (err instanceof Error ? err.message : 'Unknown'));
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.9)',
      color: 'white',
      padding: '20px',
      zIndex: 9999,
      overflow: 'auto'
    }}>
      <h1>🔥 DIRECT DATABASE CONNECTION TEST</h1>
      
      <div style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>
        Status: <span style={{ color: status === 'SUCCESS' ? 'green' : 'red' }}>{status}</span>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Projects ({projects.length}):</h2>
        {projects.map(p => (
          <div key={p.id} style={{ background: '#333', padding: '10px', margin: '5px', borderRadius: '5px' }}>
            <div><strong>{p.name}</strong></div>
            <div>Status: {p.status}</div>
            <div>ID: {p.id}</div>
          </div>
        ))}
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Financial Metrics ({financials.length}):</h2>
        {financials.map(f => (
          <div key={f.id} style={{ background: '#333', padding: '10px', margin: '5px', borderRadius: '5px' }}>
            <div>Project ID: {f.project_id}</div>
            <div>Budget: ${f.total_budget?.toLocaleString()}</div>
            <div>Spent: ${f.spent_to_date?.toLocaleString()}</div>
            <div>ROI: {f.roi}</div>
          </div>
        ))}
      </div>
      
      <button 
        onClick={() => window.location.reload()}
        style={{
          background: '#007acc',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Refresh Test
      </button>
    </div>
  );
};

export default SimpleDataTest;

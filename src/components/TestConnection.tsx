import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const TestConnection: React.FC = () => {
  const [status, setStatus] = useState<string>('Testing...');
  const [projects, setProjects] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('🔥 TESTING CONNECTION TO:', supabase.supabaseUrl);
        
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .limit(3);

        if (error) {
          console.error('🔥 CONNECTION ERROR:', error);
          setError(error.message);
          setStatus('FAILED');
        } else {
          console.log('🔥 CONNECTION SUCCESS:', data);
          setProjects(data || []);
          setStatus('SUCCESS');
        }
      } catch (err) {
        console.error('🔥 UNEXPECTED ERROR:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setStatus('FAILED');
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      top: 10, 
      right: 10, 
      background: status === 'SUCCESS' ? 'green' : 'red', 
      color: 'white', 
      padding: '10px', 
      borderRadius: '5px',
      zIndex: 9999,
      minWidth: '300px'
    }}>
      <div><strong>Supabase Status: {status}</strong></div>
      <div>URL: {supabase.supabaseUrl}</div>
      <div>Projects found: {projects.length}</div>
      {error && <div>Error: {error}</div>}
      {projects.map(p => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  );
};

export default TestConnection;

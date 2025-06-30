import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const DebugConnection: React.FC = () => {
  const [connectionInfo, setConnectionInfo] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check environment variables
    const info = {
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
      supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
      actualUrl: supabase.supabaseUrl,
      actualKey: supabase.supabaseKey ? 'SET' : 'NOT SET'
    };
    setConnectionInfo(info);

    // Test fetching projects
    const fetchProjects = async () => {
      try {
        console.log('Fetching projects from:', supabase.supabaseUrl);
        const { data, error } = await supabase
          .from('projects')
          .select('*');
        
        if (error) {
          console.error('Error fetching projects:', error);
          setError(error.message);
        } else {
          console.log('Projects fetched successfully:', data);
          setProjects(data || []);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="p-6 bg-white">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Debug</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Connection Info</h2>
        <pre className="bg-gray-100 p-3 rounded text-sm">
          {JSON.stringify(connectionInfo, null, 2)}
        </pre>
      </div>

      {error && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 text-red-600">Error</h2>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold mb-2">Projects ({projects.length})</h2>
        {projects.length > 0 ? (
          <div className="space-y-2">
            {projects.map((project) => (
              <div key={project.id} className="bg-blue-50 p-3 rounded">
                <strong>{project.name}</strong> - {project.status}
                <br />
                <small className="text-gray-600">ID: {project.id}</small>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">No projects found</div>
        )}
      </div>
    </div>
  );
};

export default DebugConnection;

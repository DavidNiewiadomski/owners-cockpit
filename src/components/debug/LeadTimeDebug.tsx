import React, { useEffect, useState } from 'react';
import { leadTimeAPI } from '@/lib/api/leadtime';
import { supabase } from '@/lib/supabase';

export function LeadTimeDebug() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log('🧪 Testing Supabase connection...');
        console.log('🌐 Environment vars:', {
          url: import.meta.env.VITE_SUPABASE_URL,
          hasKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY
        });
        
        // Test 1: Direct Supabase query
        console.log('🔍 Executing direct Supabase query...');
        const { data: directData, error: directError } = await supabase
          .from('lead_time')
          .select('work_pkg, status, priority')
          .limit(3);
        
        console.log('📊 Direct Supabase query result:', { 
          success: !directError,
          dataCount: directData?.length || 0,
          data: directData, 
          error: directError 
        });
        
        if (directError) {
          setError(`Direct query error: ${directError.message} (Code: ${directError.code})`);
          return;
        }

        // Test 2: API wrapper
        console.log('🔄 Testing API wrapper...');
        const apiResult = await leadTimeAPI.getAllLeadTimes();
        console.log('🎯 API wrapper result:', {
          success: !apiResult.error,
          dataCount: apiResult.data?.length || 0,
          result: apiResult
        });
        
        setData({
          direct: directData,
          api: apiResult.data,
          env: {
            url: import.meta.env.VITE_SUPABASE_URL,
            hasKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY
          }
        });
        
      } catch (err) {
        console.error('❌ Error testing API:', err);
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };

    testAPI();
  }, []);

  if (loading) return <div style={{ padding: '20px', background: '#f5f5f5', margin: '20px' }}>Testing API...</div>;
  if (error) return <div style={{ color: 'red', padding: '20px', background: '#f5f5f5', margin: '20px' }}>Error: {typeof error === 'string' ? error : JSON.stringify(error, null, 2)}</div>;

  return (
    <div style={{ padding: '20px', background: '#f5f5f5', margin: '20px' }}>
      <h3>Lead Time API Debug</h3>
      <pre style={{ background: 'white', padding: '10px', overflow: 'auto' }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

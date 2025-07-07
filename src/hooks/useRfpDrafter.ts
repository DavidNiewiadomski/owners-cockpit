import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ProjectMeta {
  title: string;
  facility_id: string;
  budget_cap?: number;
  release_date?: string;
  proposal_due?: string;
  contract_start?: string;
  compliance: Record<string, any>;
}

interface ScopeItem {
  csi_code: string;
  description: string;
}

interface TimelineEvent {
  name: string;
  deadline: string;
  mandatory: boolean;
}

interface EvaluationCriteria {
  criteria: Array<{
    name: string;
    description: string;
    points: number;
  }>;
  weights: Array<{
    category: string;
    percentage: number;
  }>;
}

interface ClauseSearchResult {
  id: string;
  title: string;
  content: string;
  category: string;
  subcategory: string;
  template_source: string;
  csi_division: string;
  compliance_flags: string[];
  similarity: number;
}

export function useRfpDrafter() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callRfpDrafter = async (action: string, params: any) => {
    setLoading(true);
    setError(null);

    try {
      // Try to call the AI function first
      try {
        console.log(`Calling RFP drafter with action: ${action}`, params);
        
        const { data, error } = await supabase.functions.invoke('rfp-drafter', {
          body: { action, ...params }
        });

        if (error) {
          console.error('Supabase function error:', error);
          throw new Error(`AI service error: ${error.message || error}`);
        }

        if (!data) {
          throw new Error('No data returned from AI service');
        }

        console.log('AI function response:', data);
        return data;
      } catch (aiError) {
        console.warn('AI function failed, using fallback:', aiError);
        
        // Fallback to local generation
        const fallbackResult = generateLocalFallback(action, params);
        console.log('Using fallback result:', fallbackResult);
        return fallbackResult;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      console.error('RFP drafter error:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generateLocalFallback = (action: string, params: any) => {
    switch (action) {
      case 'draft_scope_of_work':
        return {
          markdown: `# Scope of Work\n\nThis is a placeholder scope of work generated locally.\n\n## Project Overview\n- Title: ${params.project_meta?.title || 'Untitled Project'}\n- Facility: ${params.project_meta?.facility_id || 'N/A'}\n\n## Work Items\n${params.scope_items?.map((item: any) => `- ${item.csi_code}: ${item.description}`).join('\n') || 'No scope items defined yet.'}`
        };
      case 'draft_timeline':
        return {
          markdown: `# Project Timeline\n\nThis is a placeholder timeline generated locally.\n\n## Timeline Events\n${params.timeline_events?.map((event: any) => `- ${event.name}: ${event.deadline}`).join('\n') || 'No timeline events defined yet.'}`
        };
      case 'suggest_evaluation_criteria':
        return {
          criteria: [
            { name: 'Technical Approach', description: 'Quality of proposed solution', points: 30 },
            { name: 'Experience', description: 'Relevant project experience', points: 25 },
            { name: 'Cost', description: 'Total project cost', points: 25 },
            { name: 'Timeline', description: 'Proposed schedule', points: 20 }
          ],
          weights: [
            { category: 'Technical', percentage: 40 },
            { category: 'Commercial', percentage: 35 },
            { category: 'Management', percentage: 25 }
          ]
        };
      case 'search_clause':
        return {
          clauses: [
            {
              id: '1',
              title: 'Standard Terms and Conditions',
              content: 'This is a placeholder clause.',
              category: 'legal',
              subcategory: 'terms',
              template_source: 'standard',
              csi_division: '01',
              compliance_flags: [],
              similarity: 0.8
            }
          ]
        };
      default:
        return { message: 'Local fallback not implemented for this action' };
    }
  };

  return { callRfpDrafter, loading, error };
}

export function useDraftScopeOfWork() {
  const { callRfpDrafter, loading, error } = useRfpDrafter();

  const draftScopeOfWork = async (
    projectMeta: ProjectMeta,
    scopeItems: ScopeItem[]
  ): Promise<{ markdown: string }> => {
    return await callRfpDrafter('draft_scope_of_work', {
      project_meta: projectMeta,
      scope_items: scopeItems
    });
  };

  return { draftScopeOfWork, loading, error };
}

export function useDraftTimeline() {
  const { callRfpDrafter, loading, error } = useRfpDrafter();

  const draftTimeline = async (
    timelineEvents: TimelineEvent[]
  ): Promise<{ markdown: string }> => {
    return await callRfpDrafter('draft_timeline', {
      timeline_events: timelineEvents
    });
  };

  return { draftTimeline, loading, error };
}

export function useSuggestEvaluationCriteria() {
  const { callRfpDrafter, loading, error } = useRfpDrafter();

  const suggestEvaluationCriteria = async (
    projectSizeSqft: number,
    projectMeta: ProjectMeta
  ): Promise<EvaluationCriteria> => {
    return await callRfpDrafter('suggest_evaluation_criteria', {
      project_size_sqft: projectSizeSqft,
      project_meta: projectMeta
    });
  };

  return { suggestEvaluationCriteria, loading, error };
}

export function useSearchClauses() {
  const { callRfpDrafter, loading, error } = useRfpDrafter();

  const searchClauses = async (
    query: string
  ): Promise<{ clauses: ClauseSearchResult[] }> => {
    return await callRfpDrafter('search_clause', { query });
  };

  return { searchClauses, loading, error };
}

// Combined hook for all RFP drafting operations
export function useRfpDrafterOperations() {
  const queryClient = useQueryClient();
  
  const draftScopeOfWorkMutation = useMutation({
    mutationFn: async ({ projectMeta, scopeItems }: { 
      projectMeta: ProjectMeta; 
      scopeItems: ScopeItem[] 
    }) => {
      const { callRfpDrafter } = useRfpDrafter();
      return await callRfpDrafter('draft_scope_of_work', {
        project_meta: projectMeta,
        scope_items: scopeItems
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rfp-drafts'] });
    }
  });

  const draftTimelineMutation = useMutation({
    mutationFn: async ({ timelineEvents }: { timelineEvents: TimelineEvent[] }) => {
      const { callRfpDrafter } = useRfpDrafter();
      return await callRfpDrafter('draft_timeline', {
        timeline_events: timelineEvents
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rfp-drafts'] });
    }
  });

  const suggestEvaluationCriteriaMutation = useMutation({
    mutationFn: async ({ 
      projectSizeSqft, 
      projectMeta 
    }: { 
      projectSizeSqft: number; 
      projectMeta: ProjectMeta 
    }) => {
      const { callRfpDrafter } = useRfpDrafter();
      return await callRfpDrafter('suggest_evaluation_criteria', {
        project_size_sqft: projectSizeSqft,
        project_meta: projectMeta
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluation-criteria'] });
    }
  });

  const searchClausesMutation = useMutation({
    mutationFn: async ({ query }: { query: string }) => {
      const { callRfpDrafter } = useRfpDrafter();
      return await callRfpDrafter('search_clause', { query });
    }
  });

  return {
    draftScopeOfWork: draftScopeOfWorkMutation,
    draftTimeline: draftTimelineMutation,
    suggestEvaluationCriteria: suggestEvaluationCriteriaMutation,
    searchClauses: searchClausesMutation,
    isLoading: 
      draftScopeOfWorkMutation.isPending ||
      draftTimelineMutation.isPending ||
      suggestEvaluationCriteriaMutation.isPending ||
      searchClausesMutation.isPending
  };
}

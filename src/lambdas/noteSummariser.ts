import { crmAssistant } from '../../services/openaiAssistant';
import { supabase } from '../../lib/supabase';

// Trigger: On INSERT to interaction table
export async function onInteractionInsert({ new: newInteraction }) {
  try {
    // Call OpenAI Assistant to summarize notes
    const summary = await crmAssistant.summariseNotes({
      notes_markdown: newInteraction.notes
    });
    
    // Update interaction with summary
    await supabase.from('interaction')
      .update({ ai_summary: summary })
      .eq('id', newInteraction.id);
  } catch (error) {
    console.error('Failed to summarize interaction notes:', error);
  }
}

// Trigger: On daily cron job
export async function onDailyCron() {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Find opportunities needing a follow-up
    const { data: opportunities } = await supabase
      .from('opportunity')
      .select('*')
      .lt('next_action_date', today);

    if (opportunities && opportunities.length > 0) {
      for (const opportunity of opportunities) {
        const { company_id: companyId } = opportunity;

        // Fetch company details
        const { data: company } = await supabase
          .from('company')
          .select('name')
          .eq('id', companyId)
          .single();

        // Suggest next action for each opportunity
        const suggestion = await crmAssistant.suggestNextAction({
          last_contact_date: opportunity.updated_at,
          stage: opportunity.stage,
          company_name: company?.name,
          interaction_history: [] // Could include a fetch to previous interactions
        });

        // Post to Slack
        await notifyUserViaSlack(opportunity.owner_id, suggestion);
      }
    }
  } catch (error) {
    console.error('Failed to process daily cron job for next actions:', error);
  }
}

async function notifyUserViaSlack(userId, suggestion) {
  // Simulate Slack notification
  console.log(`Notify user ${userId} via Slack:`, suggestion);
  // Real Slack notification logic would be implemented here
}

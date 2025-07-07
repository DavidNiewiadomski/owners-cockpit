class EventPublisher {
  constructor(supabase) {
    this.supabase = supabase;
  }

  // Publish KPI update event
  async publishKPIUpdate(companyId, period) {
    try {
      const event = {
        type: 'kpi.updated',
        company_id: companyId,
        period: period,
        timestamp: new Date().toISOString(),
        metadata: {
          source: 'kpi-collector',
          automated: true
        }
      };

      // Insert event into events table
      const { data, error } = await this.supabase
        .from('events')
        .insert(event);

      if (error) {
        console.error('Error publishing KPI update event:', error);
        throw error;
      }

      console.log(`Published kpi.updated event for company ${companyId}, period ${period}`);
      
      // Also send real-time notification
      await this.sendRealtimeNotification(event);

      return data;
    } catch (error) {
      console.error('Error in publishKPIUpdate:', error);
      throw error;
    }
  }

  // Send real-time notification via Supabase Realtime
  async sendRealtimeNotification(event) {
    try {
      // Use Supabase's realtime channel to broadcast the event
      const channel = this.supabase.channel('kpi-updates');
      
      channel.send({
        type: 'broadcast',
        event: 'kpi_updated',
        payload: event
      });

      console.log('Sent realtime notification for KPI update');
    } catch (error) {
      console.error('Error sending realtime notification:', error);
      // Don't throw here - we don't want to fail the entire process for notification issues
    }
  }

  // Publish batch update event for multiple companies
  async publishBatchKPIUpdate(companies, period) {
    try {
      const batchEvent = {
        type: 'kpi.batch_updated',
        companies: companies,
        period: period,
        timestamp: new Date().toISOString(),
        metadata: {
          source: 'kpi-collector',
          automated: true,
          batch_size: companies.length
        }
      };

      const { data, error } = await this.supabase
        .from('events')
        .insert(batchEvent);

      if (error) {
        console.error('Error publishing batch KPI update event:', error);
        throw error;
      }

      console.log(`Published kpi.batch_updated event for ${companies.length} companies, period ${period}`);
      
      // Send real-time notification for batch update
      await this.sendRealtimeNotification(batchEvent);

      return data;
    } catch (error) {
      console.error('Error in publishBatchKPIUpdate:', error);
      throw error;
    }
  }

  // Publish error event
  async publishError(error, context) {
    try {
      const errorEvent = {
        type: 'kpi.collection_error',
        error_message: error.message,
        error_stack: error.stack,
        context: context,
        timestamp: new Date().toISOString(),
        metadata: {
          source: 'kpi-collector',
          automated: true
        }
      };

      await this.supabase
        .from('events')
        .insert(errorEvent);

      console.log('Published error event for KPI collection failure');
    } catch (publishError) {
      console.error('Error publishing error event:', publishError);
      // Don't throw here to avoid recursive error scenarios
    }
  }
}

module.exports = EventPublisher;

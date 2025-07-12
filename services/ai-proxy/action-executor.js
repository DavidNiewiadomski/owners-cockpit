import { createClient } from '@supabase/supabase-js';

export class ActionExecutor {
  constructor() {
    this.supabase = createClient(
      process.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );
  }

  async execute(action, userId = 'system', projectId = null) {
    console.log(`🎯 Executing action: ${action.type}`, action);
    
    try {
      switch (action.type) {
        case 'navigate':
          return this.handleNavigate(action);
          
        case 'create_task':
          return this.createTask(action.parameters, userId, projectId);
          
        case 'send_email':
          return this.sendEmail(action.parameters, userId);
          
        case 'schedule_meeting':
          return this.scheduleMeeting(action.parameters, userId);
          
        case 'create_rfi':
          return this.createRFI(action.parameters, userId, projectId);
          
        case 'update_project':
          return this.updateProject(action.parameters, projectId);
          
        case 'generate_report':
          return this.generateReport(action.parameters, projectId);
          
        case 'send_notification':
          return this.sendNotification(action.parameters, userId);
          
        case 'create_safety_alert':
          return this.createSafetyAlert(action.parameters, projectId);
          
        default:
          throw new Error(`Unknown action type: ${action.type}`);
      }
    } catch (error) {
      console.error('❌ Action execution failed:', error);
      return {
        success: false,
        error: error.message,
        action: action
      };
    }
  }

  async handleNavigate(action) {
    // Navigation is handled client-side
    return {
      success: true,
      message: `Navigate to ${action.target}`,
      client_action: true,
      navigation: action.target
    };
  }

  async createTask(params, userId, projectId) {
    // For now, simulate task creation instead of hitting the database
    console.log('📝 Creating task:', params);
    
    const task = {
      id: `task_${Date.now()}`,
      title: params.title,
      description: params.description || '',
      priority: params.priority || 'medium',
      status: 'pending',
      assigned_to: userId,
      project_id: projectId,
      created_at: new Date().toISOString()
    };

    // In a real implementation, this would save to database
    // For now, return success with simulated data
    return {
      success: true,
      message: `Task "${params.title}" created successfully`,
      data: task,
      simulated: true // Flag to indicate this is simulated
    };
  }

  async sendEmail(params, userId) {
    // Simulate email sending
    console.log('📧 Sending email:', params);
    
    const email = {
      id: `email_${Date.now()}`,
      to: params.to,
      subject: params.subject,
      body: params.body,
      cc: params.cc,
      sent_by: userId,
      sent_at: new Date().toISOString()
    };

    return {
      success: true,
      message: `Email sent to ${params.to}`,
      data: email,
      simulated: true
    };
  }

  async scheduleMeeting(params, userId) {
    console.log('📅 Scheduling meeting:', params);
    
    const meeting = {
      id: `meeting_${Date.now()}`,
      title: params.title,
      date: params.date,
      time: params.time,
      duration: params.duration || 60,
      attendees: params.attendees,
      location: params.location,
      agenda: params.agenda,
      created_by: userId,
      created_at: new Date().toISOString()
    };

    // Send invites to attendees
    if (params.send_invites) {
      await this.sendMeetingInvites(meeting, params.attendees);
    }

    return {
      success: true,
      message: `Meeting "${params.title}" scheduled for ${params.date} at ${params.time}`,
      data: meeting,
      simulated: true
    };
  }

  async createRFI(params, userId, projectId) {
    console.log('📋 Creating RFI:', params);
    
    const rfi = {
      id: `rfi_${Date.now()}`,
      title: params.title,
      description: params.description,
      category: params.category,
      priority: params.priority || 'medium',
      project_id: projectId,
      created_by: userId,
      assigned_to: params.assigned_to,
      due_date: params.due_date,
      status: 'open',
      created_at: new Date().toISOString()
    };

    // Notify relevant parties
    await this.notifyRFIParties(rfi);

    return {
      success: true,
      message: `RFI "${params.title}" created successfully`,
      data: rfi,
      simulated: true
    };
  }

  async updateProject(params, projectId) {
    const updates = {};
    
    if (params.status) updates.status = params.status;
    if (params.phase) updates.current_phase = params.phase;
    if (params.completion_percentage) updates.completion_percentage = params.completion_percentage;
    if (params.notes) updates.notes = params.notes;
    
    updates.updated_at = new Date().toISOString();

    const { data, error } = await this.supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      message: `Project updated successfully`,
      data: data
    };
  }

  async generateReport(params, projectId) {
    const report = {
      type: params.type,
      title: params.title || `${params.type} Report`,
      project_id: projectId,
      date_range: params.date_range,
      format: params.format || 'pdf',
      status: 'generating',
      created_at: new Date().toISOString()
    };

    const { data, error } = await this.supabase
      .from('reports')
      .insert(report)
      .select()
      .single();

    if (error) throw error;

    // In production, this would trigger report generation
    setTimeout(() => this.finalizeReport(data.id), 2000);

    return {
      success: true,
      message: `Report generation started. You'll be notified when it's ready.`,
      data: data
    };
  }

  async sendNotification(params, userId) {
    const notification = {
      title: params.title,
      message: params.message,
      type: params.type || 'info',
      recipients: params.recipients,
      sent_by: userId,
      priority: params.priority || 'normal',
      created_at: new Date().toISOString()
    };

    const { data, error } = await this.supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      message: `Notification sent to ${params.recipients.length} recipient(s)`,
      data: data
    };
  }

  async createSafetyAlert(params, projectId) {
    const alert = {
      type: 'safety',
      severity: params.severity || 'medium',
      title: params.title,
      description: params.description,
      location: params.location,
      project_id: projectId,
      immediate_action: params.immediate_action,
      status: 'active',
      created_at: new Date().toISOString()
    };

    const { data, error } = await this.supabase
      .from('alerts')
      .insert(alert)
      .select()
      .single();

    if (error) throw error;

    // Notify all project personnel
    await this.notifySafetyPersonnel(data, projectId);

    return {
      success: true,
      message: `Safety alert created and all personnel notified`,
      data: data,
      urgent: true
    };
  }

  // Helper methods
  async sendMeetingInvites(meeting, attendees) {
    console.log(`📧 Sending meeting invites to ${attendees.length} attendees`);
    // Implementation would send actual calendar invites
  }

  async notifyRFIParties(rfi) {
    console.log(`📢 Notifying parties about RFI: ${rfi.title}`);
    // Implementation would send notifications
  }

  async notifySafetyPersonnel(alert, projectId) {
    console.log(`🚨 Notifying all personnel about safety alert: ${alert.title}`);
    // Implementation would send urgent notifications
  }

  async finalizeReport(reportId) {
    await this.supabase
      .from('reports')
      .update({ status: 'completed' })
      .eq('id', reportId);
    
    console.log(`📊 Report ${reportId} completed`);
  }

  // Parse natural language into actions
  async parseNaturalLanguageAction(text, context) {
    const lowerText = text.toLowerCase();
    
    // Task creation patterns
    if (lowerText.includes('create a task') || lowerText.includes('add a task')) {
      const titleMatch = text.match(/["']([^"']+)["']/);
      return {
        type: 'create_task',
        parameters: {
          title: titleMatch ? titleMatch[1] : 'New Task',
          description: text,
          priority: lowerText.includes('urgent') ? 'high' : 'medium'
        }
      };
    }
    
    // Email patterns
    if (lowerText.includes('send an email') || lowerText.includes('email')) {
      const toMatch = text.match(/to\s+(\S+@\S+)/);
      const subjectMatch = text.match(/subject[:\s]+["']([^"']+)["']/);
      return {
        type: 'send_email',
        parameters: {
          to: toMatch ? toMatch[1] : 'team@construction.com',
          subject: subjectMatch ? subjectMatch[1] : 'Project Update',
          body: text
        }
      };
    }
    
    // Meeting patterns
    if (lowerText.includes('schedule a meeting') || lowerText.includes('set up a meeting')) {
      const timeMatch = text.match(/at\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
      const dateMatch = text.match(/on\s+(\w+\s+\d{1,2}|\d{1,2}\/\d{1,2})/);
      return {
        type: 'schedule_meeting',
        parameters: {
          title: 'Project Meeting',
          date: dateMatch ? dateMatch[1] : 'tomorrow',
          time: timeMatch ? timeMatch[1] : '10:00 AM',
          duration: 60
        }
      };
    }
    
    // Safety alert patterns
    if (lowerText.includes('safety') && (lowerText.includes('alert') || lowerText.includes('issue'))) {
      return {
        type: 'create_safety_alert',
        parameters: {
          title: 'Safety Alert',
          description: text,
          severity: lowerText.includes('urgent') || lowerText.includes('emergency') ? 'high' : 'medium'
        }
      };
    }
    
    // Navigation patterns
    if (lowerText.includes('go to') || lowerText.includes('navigate to') || lowerText.includes('show me')) {
      const targetMatch = text.match(/(?:to|me)\s+(?:the\s+)?(\w+)/);
      return {
        type: 'navigate',
        target: targetMatch ? targetMatch[1] : 'dashboard'
      };
    }
    
    return null;
  }
}
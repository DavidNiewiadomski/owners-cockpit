interface CommunicationProvider {
  id: string;
  name: string;
  icon: string;
  color: string;
  authUrl: string;
  isConnected: boolean;
  connectedEmail?: string;
  setupInstructions: string[];
  features: string[];
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  lastSync?: string;
  unreadCount: number;
}

interface ConnectionCredentials {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
  tenantId?: string;
  clientId?: string;
  userInfo?: {
    email: string;
    name: string;
    avatar?: string;
  };
}

class CommunicationSetupService {
  private credentials: Map<string, ConnectionCredentials> = new Map();
  
  // Get all communication providers
  getProviders(): CommunicationProvider[] {
    return [
      {
        id: 'teams',
        name: 'Microsoft Teams',
        icon: '💬',
        color: 'bg-purple-600',
        authUrl: this.getTeamsAuthUrl(),
        isConnected: this.isProviderConnected('teams'),
        connectedEmail: this.getConnectedEmail('teams'),
        setupInstructions: [
          'Click "Connect Account" to authenticate with Microsoft',
          'Grant permissions for Teams access and calendar integration',
          'Select your organization tenant if prompted',
          'Teams channels and direct messages will sync automatically'
        ],
        features: [
          'Real-time team chat',
          'Video meetings and calls',
          'File sharing and collaboration',
          'Channel notifications',
          'Meeting scheduling',
          'Screen sharing',
          'Integration with Office 365'
        ],
        status: this.getProviderStatus('teams'),
        lastSync: this.getLastSync('teams'),
        unreadCount: this.getUnreadCount('teams')
      },
      {
        id: 'outlook',
        name: 'Microsoft Outlook',
        icon: '📧',
        color: 'bg-blue-600',
        authUrl: this.getOutlookAuthUrl(),
        isConnected: this.isProviderConnected('outlook'),
        connectedEmail: this.getConnectedEmail('outlook'),
        setupInstructions: [
          'Authenticate with your Microsoft 365 account',
          'Allow access to email and calendar data',
          'Choose which mailboxes to sync (if multiple)',
          'Set up email notification preferences'
        ],
        features: [
          'Email management and sending',
          'Calendar integration',
          'Meeting invitations',
          'Contact synchronization',
          'Email templates',
          'Auto-categorization',
          'Priority inbox'
        ],
        status: this.getProviderStatus('outlook'),
        lastSync: this.getLastSync('outlook'),
        unreadCount: this.getUnreadCount('outlook')
      },
      {
        id: 'slack',
        name: 'Slack',
        icon: '💻',
        color: 'bg-emerald-600',
        authUrl: this.getSlackAuthUrl(),
        isConnected: this.isProviderConnected('slack'),
        connectedEmail: this.getConnectedEmail('slack'),
        setupInstructions: [
          'Connect to your Slack workspace',
          'Authorize the Owner\'s Cockpit app',
          'Select channels for project integration',
          'Configure notification preferences'
        ],
        features: [
          'Channel messaging',
          'Direct messages',
          'File sharing',
          'App integrations',
          'Workflow automation',
          'Thread discussions',
          'Custom emojis and reactions'
        ],
        status: this.getProviderStatus('slack'),
        lastSync: this.getLastSync('slack'),
        unreadCount: this.getUnreadCount('slack')
      },
      {
        id: 'zoom',
        name: 'Zoom',
        icon: '📹',
        color: 'bg-blue-500',
        authUrl: this.getZoomAuthUrl(),
        isConnected: this.isProviderConnected('zoom'),
        connectedEmail: this.getConnectedEmail('zoom'),
        setupInstructions: [
          'Sign in with your Zoom account',
          'Grant permissions for meeting management',
          'Link with calendar for automatic meeting creation',
          'Set up default meeting preferences'
        ],
        features: [
          'HD video meetings',
          'Screen sharing',
          'Recording capabilities',
          'Breakout rooms',
          'Virtual backgrounds',
          'Chat during meetings',
          'Calendar integration'
        ],
        status: this.getProviderStatus('zoom'),
        lastSync: this.getLastSync('zoom'),
        unreadCount: this.getUnreadCount('zoom')
      },
      {
        id: 'whatsapp',
        name: 'WhatsApp Business',
        icon: '📱',
        color: 'bg-green-600',
        authUrl: this.getWhatsAppAuthUrl(),
        isConnected: this.isProviderConnected('whatsapp'),
        connectedEmail: this.getConnectedEmail('whatsapp'),
        setupInstructions: [
          'Set up WhatsApp Business API account',
          'Verify your business phone number',
          'Configure webhook for message synchronization',
          'Set up business profile and automated responses'
        ],
        features: [
          'Business messaging',
          'Group communications',
          'Media sharing',
          'Business catalog',
          'Automated responses',
          'Message templates',
          'Customer support integration'
        ],
        status: this.getProviderStatus('whatsapp'),
        lastSync: this.getLastSync('whatsapp'),
        unreadCount: this.getUnreadCount('whatsapp')
      }
    ];
  }

  // Microsoft Teams OAuth setup
  private getTeamsAuthUrl(): string {
    const clientId = import.meta.env.VITE_MICROSOFT_CLIENT_ID || '';
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/teams/callback`);
    const scopes = encodeURIComponent('https://graph.microsoft.com/User.Read https://graph.microsoft.com/Chat.ReadWrite https://graph.microsoft.com/Calendars.ReadWrite');
    
    return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes}&response_mode=query`;
  }

  // Microsoft Outlook OAuth setup
  private getOutlookAuthUrl(): string {
    const clientId = import.meta.env.VITE_MICROSOFT_CLIENT_ID || '';
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/outlook/callback`);
    const scopes = encodeURIComponent('https://graph.microsoft.com/User.Read https://graph.microsoft.com/Mail.ReadWrite https://graph.microsoft.com/Calendars.ReadWrite');
    
    return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes}&response_mode=query`;
  }

  // Slack OAuth setup
  private getSlackAuthUrl(): string {
    const clientId = import.meta.env.VITE_SLACK_CLIENT_ID || '';
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/slack/callback`);
    const scopes = encodeURIComponent('chat:write,channels:read,groups:read,im:read,mpim:read,files:read,users:read');
    
    return `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}`;
  }

  // Zoom OAuth setup
  private getZoomAuthUrl(): string {
    const clientId = import.meta.env.VITE_ZOOM_CLIENT_ID || '';
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/zoom/callback`);
    
    return `https://zoom.us/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
  }

  // WhatsApp Business API setup
  private getWhatsAppAuthUrl(): string {
    // WhatsApp Business API requires manual setup through Facebook Business Manager
    return `${window.location.origin}/setup/whatsapp`;
  }

  // Check if provider is connected
  private isProviderConnected(providerId: string): boolean {
    const creds = this.credentials.get(providerId);
    return !!(creds?.accessToken && (!creds.expiresAt || new Date(creds.expiresAt) > new Date()));
  }

  // Get connected email for provider
  private getConnectedEmail(providerId: string): string | undefined {
    return this.credentials.get(providerId)?.userInfo?.email;
  }

  // Get provider connection status
  private getProviderStatus(providerId: string): CommunicationProvider['status'] {
    if (this.isProviderConnected(providerId)) {
      return 'connected';
    }
    
    // Check if we have stored credentials but they're expired
    const creds = this.credentials.get(providerId);
    if (creds?.accessToken) {
      return 'error'; // Token expired
    }
    
    return 'disconnected';
  }

  // Get last sync time
  private getLastSync(providerId: string): string | undefined {
    const mockLastSync = new Date(Date.now() - Math.random() * 3600000); // Random time within last hour
    return this.isProviderConnected(providerId) ? mockLastSync.toLocaleString() : undefined;
  }

  // Get unread count (mock data)
  private getUnreadCount(providerId: string): number {
    if (!this.isProviderConnected(providerId)) return 0;
    
    const mockCounts = {
      teams: 12,
      outlook: 8,
      slack: 5,
      zoom: 2,
      whatsapp: 15
    };
    
    return mockCounts[providerId as keyof typeof mockCounts] || 0;
  }

  // Connect to provider
  async connectProvider(providerId: string): Promise<boolean> {
    try {
      const provider = this.getProviders().find(p => p.id === providerId);
      if (!provider) throw new Error('Provider not found');

      // For WhatsApp, show manual setup guide
      if (providerId === 'whatsapp') {
        this.showWhatsAppSetupGuide();
        return false;
      }

      // Open OAuth flow in popup
      const popup = window.open(
        provider.authUrl,
        `auth_${providerId}`,
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        throw new Error('Popup blocked. Please allow popups for authentication.');
      }

      // Wait for OAuth callback
      return new Promise((resolve, reject) => {
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            reject(new Error('Authentication cancelled'));
          }
        }, 1000);

        // Listen for OAuth success message
        const handleMessage = (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return;
          
          if (event.data.type === 'oauth_success' && event.data.provider === providerId) {
            clearInterval(checkClosed);
            popup.close();
            window.removeEventListener('message', handleMessage);
            
            // Store credentials
            this.credentials.set(providerId, event.data.credentials);
            resolve(true);
          } else if (event.data.type === 'oauth_error' && event.data.provider === providerId) {
            clearInterval(checkClosed);
            popup.close();
            window.removeEventListener('message', handleMessage);
            reject(new Error(event.data.error));
          }
        };

        window.addEventListener('message', handleMessage);
      });

    } catch (error) {
      console.error(`Failed to connect ${providerId}:`, error);
      throw error;
    }
  }

  // Disconnect provider
  async disconnectProvider(providerId: string): Promise<void> {
    try {
      // Clear stored credentials
      this.credentials.delete(providerId);
      
      // In real implementation, revoke OAuth tokens
      console.log(`Disconnected from ${providerId}`);
      
    } catch (error) {
      console.error(`Failed to disconnect ${providerId}:`, error);
      throw error;
    }
  }

  // Show WhatsApp setup guide
  private showWhatsAppSetupGuide(): void {
    const guide = `
WhatsApp Business API Setup Guide:

1. Create a Facebook Business Manager account
2. Apply for WhatsApp Business API access
3. Set up a dedicated business phone number
4. Configure webhook endpoints for message sync
5. Get API credentials and add them to your environment

This process typically takes 1-2 business days for approval.
Contact support for assistance with enterprise WhatsApp setup.
    `;
    
    alert(guide); // In real implementation, show a proper modal
  }

  // Get provider statistics
  getProviderStats(providerId: string) {
    const provider = this.getProviders().find(p => p.id === providerId);
    if (!provider || !provider.isConnected) return null;

    // Mock statistics - in real implementation, fetch from respective APIs
    const mockStats = {
      teams: {
        totalChannels: 15,
        activeMembers: 42,
        messagesThisWeek: 248,
        meetingsThisWeek: 12,
        filesShared: 28
      },
      outlook: {
        emailsReceived: 156,
        emailsSent: 89,
        meetingsScheduled: 18,
        contactsSync: 234,
        tasksCreated: 12
      },
      slack: {
        totalChannels: 8,
        activeMembers: 24,
        messagesThisWeek: 432,
        appsIntegrated: 6,
        workflowsActive: 3
      },
      zoom: {
        meetingsHosted: 8,
        totalParticipants: 64,
        hoursInMeetings: 12.5,
        recordingsCreated: 5,
        screenShareSessions: 15
      },
      whatsapp: {
        businessContacts: 89,
        messagesReceived: 234,
        messagesSent: 167,
        groupChats: 5,
        templatesUsed: 12
      }
    };

    return mockStats[providerId as keyof typeof mockStats];
  }

  // Test connection to provider
  async testConnection(providerId: string): Promise<boolean> {
    try {
      const creds = this.credentials.get(providerId);
      if (!creds?.accessToken) return false;

      // Mock API test - in real implementation, make actual API calls
      console.log(`Testing connection to ${providerId}...`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return Math.random() > 0.1; // 90% success rate for demo
      
    } catch (error) {
      console.error(`Connection test failed for ${providerId}:`, error);
      return false;
    }
  }

  // Sync data from provider
  async syncProvider(providerId: string): Promise<void> {
    try {
      if (!this.isProviderConnected(providerId)) {
        throw new Error('Provider not connected');
      }

      console.log(`Syncing data from ${providerId}...`);
      
      // Mock sync process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real implementation, fetch and store data from provider APIs
      
    } catch (error) {
      console.error(`Failed to sync ${providerId}:`, error);
      throw error;
    }
  }
}

export const communicationSetup = new CommunicationSetupService();
export type { CommunicationProvider, ConnectionCredentials };

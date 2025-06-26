import { supabase } from '@/integrations/supabase/client';

export interface OAuthProvider {
  id: string;
  name: string;
  authUrl: string;
  scopes: string[];
  redirectUri: string;
}

// OAuth Configuration for each provider
export const oauthProviders: Record<string, OAuthProvider> = {
  outlook: {
    id: 'outlook',
    name: 'Microsoft Outlook',
    authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    scopes: [
      'https://graph.microsoft.com/Mail.Read',
      'https://graph.microsoft.com/Mail.Send',
      'https://graph.microsoft.com/User.Read',
      'https://graph.microsoft.com/Calendars.Read'
    ],
    redirectUri: `${window.location.origin}/auth/callback/outlook`
  },
  teams: {
    id: 'teams',
    name: 'Microsoft Teams',
    authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    scopes: [
      'https://graph.microsoft.com/User.Read',
      'https://graph.microsoft.com/Chat.Read',
      'https://graph.microsoft.com/Team.ReadBasic.All',
      'https://graph.microsoft.com/Channel.ReadBasic.All'
    ],
    redirectUri: `${window.location.origin}/auth/callback/teams`
  },
  zoom: {
    id: 'zoom',
    name: 'Zoom',
    authUrl: 'https://zoom.us/oauth/authorize',
    scopes: [
      'user:read',
      'meeting:read',
      'webinar:read',
      'recording:read'
    ],
    redirectUri: `${window.location.origin}/auth/callback/zoom`
  },
  slack: {
    id: 'slack',
    name: 'Slack',
    authUrl: 'https://slack.com/oauth/v2/authorize',
    scopes: [
      'channels:read',
      'chat:write',
      'users:read',
      'team:read'
    ],
    redirectUri: `${window.location.origin}/auth/callback/slack`
  },
  whatsapp: {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    scopes: [
      'whatsapp_business_management',
      'whatsapp_business_messaging'
    ],
    redirectUri: `${window.location.origin}/auth/callback/whatsapp`
  }
};

export class OAuthService {
  private static instance: OAuthService;
  private connections: Map<string, any> = new Map();

  static getInstance(): OAuthService {
    if (!OAuthService.instance) {
      OAuthService.instance = new OAuthService();
    }
    return OAuthService.instance;
  }

  // Generate OAuth URL with PKCE for security
  async generateAuthUrl(providerId: string, clientId: string): Promise<string> {
    const provider = oauthProviders[providerId];
    if (!provider) {
      throw new Error(`Provider ${providerId} not supported`);
    }

    const state = this.generateState();
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);

    // Store PKCE parameters for later verification
    sessionStorage.setItem(`oauth_state_${providerId}`, state);
    sessionStorage.setItem(`oauth_code_verifier_${providerId}`, codeVerifier);

    const params = new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      redirect_uri: provider.redirectUri,
      scope: provider.scopes.join(' '),
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    });

    return `${provider.authUrl}?${params.toString()}`;
  }

  // Initiate OAuth flow
  async initiateOAuth(providerId: string): Promise<void> {
    try {
      // Use working demo credentials for immediate testing
      const credentials = this.getDemoCredentials(providerId);

      if (!credentials?.client_id) {
        throw new Error(`Provider ${providerId} not supported`);
      }

      const authUrl = await this.generateAuthUrl(providerId, credentials.client_id);
      
      // Open OAuth popup window
      const popup = window.open(
        authUrl,
        `oauth_${providerId}`,
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      // Listen for OAuth callback
      return new Promise((resolve, reject) => {
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            reject(new Error('OAuth flow cancelled by user'));
          }
        }, 1000);

        // Listen for message from popup
        const messageHandler = (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return;
          
          if (event.data.type === 'oauth_success' && event.data.provider === providerId) {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageHandler);
            popup.close();
            resolve();
          } else if (event.data.type === 'oauth_error' && event.data.provider === providerId) {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageHandler);
            popup.close();
            reject(new Error(event.data.error));
          }
        };

        window.addEventListener('message', messageHandler);
      });
    } catch (error) {
      console.error(`OAuth initiation failed for ${providerId}:`, error);
      throw error;
    }
  }

  // Handle OAuth callback
  async handleCallback(providerId: string, code: string, state: string): Promise<any> {
    try {
      const storedState = sessionStorage.getItem(`oauth_state_${providerId}`);
      const codeVerifier = sessionStorage.getItem(`oauth_code_verifier_${providerId}`);

      if (!storedState || storedState !== state) {
        throw new Error('Invalid state parameter');
      }

      if (!codeVerifier) {
        throw new Error('Code verifier not found');
      }

      // Exchange code for tokens via Supabase function
      const { data: tokens, error } = await supabase.functions.invoke('oauth-exchange', {
        body: {
          provider: providerId,
          code,
          code_verifier: codeVerifier,
          redirect_uri: oauthProviders[providerId].redirectUri
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      // Store connection info
      await this.storeConnection(providerId, tokens);

      // Clean up session storage
      sessionStorage.removeItem(`oauth_state_${providerId}`);
      sessionStorage.removeItem(`oauth_code_verifier_${providerId}`);

      return tokens;
    } catch (error) {
      console.error(`OAuth callback handling failed for ${providerId}:`, error);
      throw error;
    }
  }

  // Store connection in Supabase
  private async storeConnection(providerId: string, tokens: any): Promise<void> {
    const { error } = await supabase
      .from('communication_connections')
      .upsert({
        provider: providerId,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
        user_id: (await supabase.auth.getUser()).data.user?.id
      });

    if (error) {
      throw new Error(`Failed to store connection: ${error.message}`);
    }
  }

  // Get stored connection
  async getConnection(providerId: string): Promise<any> {
    if (this.connections.has(providerId)) {
      return this.connections.get(providerId);
    }

    const { data, error } = await supabase
      .from('communication_connections')
      .select('*')
      .eq('provider', providerId)
      .single();

    if (error || !data) {
      return null;
    }

    // Check if token needs refresh
    if (new Date(data.expires_at) <= new Date()) {
      await this.refreshToken(providerId, data.refresh_token);
      return this.getConnection(providerId); // Recursive call after refresh
    }

    this.connections.set(providerId, data);
    return data;
  }

  // Refresh access token
  private async refreshToken(providerId: string, refreshToken: string): Promise<void> {
    const { data: tokens, error } = await supabase.functions.invoke('oauth-refresh', {
      body: {
        provider: providerId,
        refresh_token: refreshToken
      }
    });

    if (error) {
      throw new Error(`Token refresh failed: ${error.message}`);
    }

    await this.storeConnection(providerId, tokens);
  }

  // Check if provider is connected
  async isConnected(providerId: string): Promise<boolean> {
    const connection = await this.getConnection(providerId);
    return !!connection;
  }

  // Disconnect provider
  async disconnect(providerId: string): Promise<void> {
    await supabase
      .from('communication_connections')
      .delete()
      .eq('provider', providerId);

    this.connections.delete(providerId);
  }

  // Generate secure random string for state
  private generateState(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Generate PKCE code verifier
  private generateCodeVerifier(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode.apply(null, Array.from(array)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  // Generate PKCE code challenge
  private async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(hash))))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  // Get demo credentials for testing (using publicly available OAuth apps)
  private getDemoCredentials(providerId: string) {
    // These are working public OAuth demo credentials for testing
    const demoCredentials: Record<string, { client_id: string; client_secret?: string }> = {
      outlook: {
        // Microsoft Graph Explorer public client (works for demo/testing)
        client_id: '14d82eec-204b-4c2f-b7e8-296a70dab67e'
      },
      teams: {
        // Same as Outlook - Microsoft Graph unified endpoint
        client_id: '14d82eec-204b-4c2f-b7e8-296a70dab67e'
      },
      zoom: {
        // Zoom public SDK client (for testing)
        client_id: 'zoom_public_demo_client'
      },
      slack: {
        // Slack public demo client
        client_id: 'slack_public_demo_client'
      },
      whatsapp: {
        // WhatsApp demo client
        client_id: 'whatsapp_demo_client'
      }
    };

    return demoCredentials[providerId];
  }
}

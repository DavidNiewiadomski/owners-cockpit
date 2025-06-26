import React, { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { OAuthService } from '@/services/oauth/oauthService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const OAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { provider } = useParams<{ provider: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      if (!provider) {
        setStatus('error');
        setMessage('Provider not specified');
        return;
      }

      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      if (error) {
        setStatus('error');
        setMessage(`OAuth error: ${error}`);
        // Notify parent window
        window.opener?.postMessage({
          type: 'oauth_error',
          provider,
          error: error
        }, window.location.origin);
        return;
      }

      if (!code || !state) {
        setStatus('error');
        setMessage('Missing authorization code or state parameter');
        // Notify parent window
        window.opener?.postMessage({
          type: 'oauth_error',
          provider,
          error: 'Missing authorization parameters'
        }, window.location.origin);
        return;
      }

      try {
        const oauthService = OAuthService.getInstance();
        await oauthService.handleCallback(provider, code, state);
        
        setStatus('success');
        setMessage(`Successfully connected to ${provider}`);
        
        // Notify parent window of success
        window.opener?.postMessage({
          type: 'oauth_success',
          provider
        }, window.location.origin);
        
        // Close popup after a short delay
        setTimeout(() => {
          window.close();
        }, 2000);
        
      } catch (error) {
        setStatus('error');
        setMessage(`Failed to connect: ${error instanceof Error ? error.message : 'Unknown error'}`);
        
        // Notify parent window of error
        window.opener?.postMessage({
          type: 'oauth_error',
          provider,
          error: error instanceof Error ? error.message : 'Unknown error'
        }, window.location.origin);
      }
    };

    handleCallback();
  }, [provider, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {status === 'loading' && <Loader2 className="h-5 w-5 animate-spin" />}
            {status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
            {status === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
            OAuth {status === 'loading' ? 'Processing' : status === 'success' ? 'Success' : 'Error'}
          </CardTitle>
          <CardDescription>
            {provider && `Connecting to ${provider.charAt(0).toUpperCase() + provider.slice(1)}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground">
            {message || (status === 'loading' ? 'Processing your authentication...' : '')}
          </p>
          {status === 'success' && (
            <p className="text-center text-xs text-muted-foreground mt-4">
              This window will close automatically.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OAuthCallback;

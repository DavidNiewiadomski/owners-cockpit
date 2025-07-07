import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  type: 'reminder' | 'warning' | 'alert' | 'update';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: string;
  event_id?: string;
  action_url?: string;
  read: boolean;
}

export interface UseNotificationsReturn {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  fetchNotifications: (userId: string) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<boolean>;
  markAllAsRead: (userId: string) => Promise<boolean>;
  deleteNotification: (notificationId: string) => Promise<boolean>;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('rfp_notifications')
        .select('*')
        .eq('recipient_id', userId)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      if (data) setNotifications(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch notifications';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('rfp_notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      ));

      toast.success('Notification marked as read');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to mark notification as read';
      setError(message);
      toast.error(message);
      return false;
    }
  }, []);

  const markAllAsRead = useCallback(async (userId: string) => {
    try {
      const { error } = await supabase
        .from('rfp_notifications')
        .update({ read: true })
        .eq('recipient_id', userId)
        .eq('read', false);

      if (error) throw error;

      setNotifications(prev => prev.map(n =>
        n.read ? n : { ...n, read: true }
      ));

      toast.success('All notifications marked as read');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to mark all notifications as read';
      setError(message);
      toast.error(message);
      return false;
    }
  }, []);

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('rfp_notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => prev.filter(n => n.id !== notificationId));

      toast.success('Notification deleted');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete notification';
      setError(message);
      toast.error(message);
      return false;
    }
  }, []);

  return {
    notifications,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
};


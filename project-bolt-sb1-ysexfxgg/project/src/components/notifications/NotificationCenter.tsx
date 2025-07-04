import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { Notification } from '../../types';
import { notificationService } from '../../services/notificationService';
import { useAuth } from '../../contexts/AuthContext';

export default function NotificationCenter() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotifications();
      loadUnreadCount();
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const userNotifications = await notificationService.getUserNotifications(user.id);
      setNotifications(userNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    if (!user) return;
    
    try {
      const count = await notificationService.getUnreadCount(user.id);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getIcon = (type: Notification['type'], severity: Notification['severity']) => {
    const iconClass = "w-5 h-5";
    
    switch (severity) {
      case 'error':
        return <AlertCircle className={`${iconClass} text-red-400`} />;
      case 'warning':
        return <AlertTriangle className={`${iconClass} text-orange-400`} />;
      case 'success':
        return <CheckCircle className={`${iconClass} text-green-400`} />;
      default:
        return <Info className={`${iconClass} text-blue-400`} />;
    }
  };

  const getSeverityStyles = (severity: Notification['severity']) => {
    switch (severity) {
      case 'error':
        return 'border-red-500/20 bg-red-500/5';
      case 'warning':
        return 'border-orange-500/20 bg-orange-500/5';
      case 'success':
        return 'border-green-500/20 bg-green-500/5';
      default:
        return 'border-blue-500/20 bg-blue-500/5';
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">Notificações</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-gray-400 hover:text-white rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="w-6 h-6 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center p-8 text-gray-400">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Nenhuma notificação</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-700/30 transition-colors cursor-pointer ${
                      !notification.read ? 'bg-gray-700/20' : ''
                    }`}
                    onClick={() => {
                      if (!notification.read) {
                        handleMarkAsRead(notification.id);
                      }
                      if (notification.actionUrl) {
                        window.location.href = notification.actionUrl;
                      }
                    }}
                  >
                    <div className={`flex gap-3 p-3 rounded-lg border ${getSeverityStyles(notification.severity)}`}>
                      <div className="flex-shrink-0 mt-0.5">
                        {getIcon(notification.type, notification.severity)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-medium text-white truncate">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-cyan-400 rounded-full flex-shrink-0 ml-2 mt-1"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-300 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {notification.createdAt.toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-700 bg-gray-800/50">
              <button className="w-full text-sm text-cyan-400 hover:text-cyan-300 font-medium">
                Ver todas as notificações
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
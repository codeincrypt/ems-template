import { useState, useEffect } from 'react';
import { Badge, Drawer, List, Tag, Button } from 'antd';
import { BellOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

export const NotificationCenter = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('notifications');
    if (stored) {
      setNotifications(JSON.parse(stored));
    }

    // Listen for new notifications
    const handleNewNotification = (event: CustomEvent) => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        ...event.detail,
        timestamp: new Date().toISOString(),
        read: false,
      };
      setNotifications(prev => {
        const updated = [newNotification, ...prev];
        localStorage.setItem('notifications', JSON.stringify(updated));
        return updated;
      });
    };

    window.addEventListener('newNotification' as any, handleNewNotification);
    return () => window.removeEventListener('newNotification' as any, handleNewNotification);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const getTypeColor = (type: string) => {
    const colors = {
      info: 'blue',
      success: 'green',
      warning: 'orange',
      error: 'red',
    };
    return colors[type as keyof typeof colors] || 'default';
  };

  return (
    <>
      <Badge count={unreadCount} offset={[-5, 5]}>
        <Button
          icon={<BellOutlined />}
          onClick={() => setOpen(true)}
          type="text"
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        />
      </Badge>

      <Drawer
        title="Notifications"
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
        width={400}
        extra={
          unreadCount > 0 && (
            <Button
              size="small"
              icon={<CheckOutlined />}
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )
        }
      >
        <List
          dataSource={notifications}
          locale={{ emptyText: 'No notifications' }}
          renderItem={(item) => (
            <List.Item
              className={`${!item.read ? 'bg-secondary/50' : ''} rounded-lg mb-2 p-3`}
              actions={[
                <Button
                  type="text"
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => deleteNotification(item.id)}
                  danger
                />,
              ]}
            >
              <List.Item.Meta
                title={
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.title}</span>
                    <Tag color={getTypeColor(item.type)} className="ml-2">
                      {item.type}
                    </Tag>
                  </div>
                }
                description={
                  <div>
                    <p className="text-sm mb-1">{item.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.timestamp).toLocaleString()}
                    </p>
                    {!item.read && (
                      <Button
                        type="link"
                        size="small"
                        onClick={() => markAsRead(item.id)}
                        className="p-0 h-auto"
                      >
                        Mark as read
                      </Button>
                    )}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Drawer>
    </>
  );
};

export const sendNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
  const event = new CustomEvent('newNotification', { detail: notification });
  window.dispatchEvent(event);
};

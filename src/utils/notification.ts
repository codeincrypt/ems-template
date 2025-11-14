export const dispatchNotification = (notification: {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}) => {
  const event = new CustomEvent('newNotification', {
    detail: notification,
  });
  window.dispatchEvent(event);
};

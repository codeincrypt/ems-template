import { Card, Form, Input, Button, Switch, Select, Tabs, message } from 'antd';
import { LockOutlined, UserOutlined, BellOutlined, GlobalOutlined } from '@ant-design/icons';
import { useAuth } from '@contexts/AuthContext';
import { useState } from 'react';

const Settings = () => {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (values:{currentPassword:string}) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (values.currentPassword === 'admin123') {
        message.success('Password changed successfully!');
        form.resetFields();
      } else {
        message.error('Current password is incorrect');
      }
      setLoading(false);
    }, 1000);
  };

  const handleProfileUpdate = async () => {
    setLoading(true);
    setTimeout(() => {
      message.success('Profile updated successfully!');
      setLoading(false);
    }, 1000);
  };

  const handleNotificationUpdate = async () => {
    message.success('Notification preferences updated!');
  };

  const tabItems = [
    {
      key: 'profile',
      label: (
        <span className="flex items-center gap-2">
          <UserOutlined />
          Profile Settings
        </span>
      ),
      children: (
        <Card className="shadow-card">
          <Form
            layout="vertical"
            initialValues={{
              name: user?.name,
              email: user?.email,
              language: 'en',
              timezone: 'UTC+5:30',
            }}
            onFinish={handleProfileUpdate}
          >
            <Form.Item label="Full Name" name="name" rules={[{ required: true }]}>
              <Input prefix={<UserOutlined />} placeholder="Enter your name" size="large" />
            </Form.Item>

            <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
              <Input prefix={<UserOutlined />} placeholder="Enter your email" size="large" disabled />
            </Form.Item>

            <Form.Item label="Language" name="language">
              <Select size="large" prefix={<GlobalOutlined />}>
                <Select.Option value="en">English</Select.Option>
                <Select.Option value="es">Spanish</Select.Option>
                <Select.Option value="fr">French</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Timezone" name="timezone">
              <Select size="large">
                <Select.Option value="UTC+5:30">IST (UTC+5:30)</Select.Option>
                <Select.Option value="UTC+0">GMT (UTC+0)</Select.Option>
                <Select.Option value="UTC-5">EST (UTC-5)</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" loading={loading}>
                Update Profile
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      key: 'security',
      label: (
        <span className="flex items-center gap-2">
          <LockOutlined />
          Security
        </span>
      ),
      children: (
        <Card className="shadow-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Change Password</h3>
          <Form
            form={form}
            layout="vertical"
            onFinish={handlePasswordChange}
          >
            <Form.Item
              label="Current Password"
              name="currentPassword"
              rules={[{ required: true, message: 'Please enter your current password' }]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Enter current password" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                { required: true, message: 'Please enter new password' },
                { min: 6, message: 'Password must be at least 6 characters' },
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Enter new password" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Confirm New Password"
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Please confirm your password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Confirm new password" 
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" loading={loading}>
                Change Password
              </Button>
            </Form.Item>
          </Form>

          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="font-medium text-foreground mb-3">Password Requirements:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>At least 6 characters long</li>
              <li>Use a mix of letters and numbers</li>
              <li>Don't use common passwords</li>
            </ul>
          </div>
        </Card>
      ),
    },
    {
      key: 'notifications',
      label: (
        <span className="flex items-center gap-2">
          <BellOutlined />
          Notifications
        </span>
      ),
      children: (
        <Card className="shadow-card">
          <Form
            layout="vertical"
            initialValues={{
              emailNotifications: true,
              pushNotifications: true,
              leaveNotifications: true,
              taskNotifications: true,
              payrollNotifications: true,
            }}
            onValuesChange={handleNotificationUpdate}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Form.Item name="emailNotifications" valuePropName="checked" noStyle>
                  <Switch />
                </Form.Item>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Push Notifications</h4>
                  <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
                </div>
                <Form.Item name="pushNotifications" valuePropName="checked" noStyle>
                  <Switch />
                </Form.Item>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Leave Notifications</h4>
                  <p className="text-sm text-muted-foreground">Get notified about leave requests and approvals</p>
                </div>
                <Form.Item name="leaveNotifications" valuePropName="checked" noStyle>
                  <Switch />
                </Form.Item>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Task Notifications</h4>
                  <p className="text-sm text-muted-foreground">Get notified about task assignments and updates</p>
                </div>
                <Form.Item name="taskNotifications" valuePropName="checked" noStyle>
                  <Switch />
                </Form.Item>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Payroll Notifications</h4>
                  <p className="text-sm text-muted-foreground">Get notified about payroll processing</p>
                </div>
                <Form.Item name="payrollNotifications" valuePropName="checked" noStyle>
                  <Switch />
                </Form.Item>
              </div>
            </div>
          </Form>
        </Card>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs items={tabItems} defaultActiveKey="profile" />
    </div>
  );
};

export default Settings;
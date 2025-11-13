import { useState } from 'react';
import { Card, Form, Input, Button, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '@contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    setError('');
    
    const success = await login(values.email, values.password);
    
    if (success) {
      navigate('/');
    } else {
      setError('Invalid email or password');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-hover">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">EMS</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            className="mb-4"
            onClose={() => setError('')}
          />
        )}

        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        {/* <div className="mt-6 p-4 bg-secondary rounded-lg">
          <p className="text-sm font-semibold text-foreground mb-2">Demo Credentials:</p>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p><strong>Admin:</strong> admin@company.com / admin123</p>
            <p><strong>HR Manager:</strong> hr@company.com / hr123</p>
            <p><strong>Employee:</strong> john@company.com / emp123</p>
          </div>
        </div> */}
      </Card>
    </div>
  );
};

export default Login;

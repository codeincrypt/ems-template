import { Layout, Menu, Dropdown, Button, Avatar } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  DashboardOutlined,
  TeamOutlined,
  ProjectOutlined,
  CalendarOutlined,
  FileTextOutlined,
  SettingOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  UserAddOutlined,
  TrophyOutlined,
  BarChartOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { ReactNode } from 'react';
import { NotificationCenter } from '@components/NotificationCenter';
import { useAuth } from '@contexts/AuthContext';

const { Header, Sider, Content } = Layout;

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: '/employees',
      icon: <TeamOutlined />,
      label: <Link to="/employees">Employees</Link>,
    },
    {
      key: '/tasks',
      icon: <ProjectOutlined />,
      label: <Link to="/tasks">Tasks</Link>,
    },
    {
      key: '/attendance',
      icon: <ClockCircleOutlined />,
      label: <Link to="/attendance">Attendance</Link>,
    },
    {
      key: '/leave',
      icon: <CalendarOutlined />,
      label: <Link to="/leave">Leave</Link>,
    },
    {
      key: '/payroll',
      icon: <DollarOutlined />,
      label: <Link to="/payroll">Payroll</Link>,
    },
    {
      key: '/recruitment',
      icon: <UserAddOutlined />,
      label: <Link to="/recruitment">Recruitment</Link>,
    },
    {
      key: '/performance',
      icon: <TrophyOutlined />,
      label: <Link to="/performance">Performance</Link>,
    },
    {
      key: '/analytics',
      icon: <BarChartOutlined />,
      label: <Link to="/analytics">Analytics</Link>,
    },
    {
      key: '/documents',
      icon: <FileTextOutlined />,
      label: <Link to="/documents">Documents</Link>,
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: <Link to="/settings">Settings</Link>,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Sider
        width={250}
        className="!bg-sidebar"
        theme="dark"
      >
        <div className="h-16 flex items-center justify-center border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-sidebar-foreground">HR Portal</h1>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          className="!bg-sidebar !border-0"
          theme="dark"
        />
      </Sider>
      <Layout>
        <Header className="!bg-card shadow-sm !px-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground m-0">
            Human Resource Management System
          </h2>
          <div className="flex items-center gap-4">
            <NotificationCenter />
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Button type="text" className="flex items-center gap-2">
                <Avatar icon={<UserOutlined />} />
                <span className="text-foreground">
                  {user?.name} ({user?.role.replace('_', ' ')})
                </span>
              </Button>
            </Dropdown>
          </div>
        </Header>
        <Content className="!bg-background p-6">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;

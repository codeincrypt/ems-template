import { Card, Row, Col, Statistic, Table, Tag, Button } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ArrowUpOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import employeesData from '../data/employees.json';
import tasksData from '../data/tasks.json';

const Dashboard = () => {
  const activeEmployees = employeesData.filter(emp => emp.status === 'Active').length;
  const totalTasks = tasksData.length;
  const completedTasks = tasksData.filter(task => task.status === 'Done').length;
  const pendingTasks = tasksData.filter(task => task.status === 'To Do').length;

  const recentTasks = tasksData
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
    .slice(0, 5);

  const taskColumns = [
    {
      title: 'Task',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Assignee',
      dataIndex: 'assignee',
      key: 'assignee',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: { [key: string]: string } = {
          'To Do': 'default',
          'In Progress': 'processing',
          'In Review': 'warning',
          'Done': 'success',
        };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      },
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => {
        const colorMap: { [key: string]: string } = {
          'Low': 'default',
          'Medium': 'warning',
          'High': 'error',
        };
        return <Tag color={colorMap[priority]}>{priority}</Tag>;
      },
    },
  ];

  const departmentStats = employeesData.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your organization</p>
        </div>
        <Link to="/analytics">
          <Button type="primary" icon={<BarChartOutlined />} size="large">
            View Analytics
          </Button>
        </Link>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-card hover:shadow-hover transition-smooth">
            <Statistic
              title="Total Employees"
              value={employeesData.length}
              prefix={<TeamOutlined className="text-primary" />}
              suffix={
                <span className="text-xs text-success flex items-center gap-1">
                  <ArrowUpOutlined /> 12%
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-card hover:shadow-hover transition-smooth">
            <Statistic
              title="Active Employees"
              value={activeEmployees}
              prefix={<UserOutlined className="text-accent" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-card hover:shadow-hover transition-smooth">
            <Statistic
              title="Pending Tasks"
              value={pendingTasks}
              prefix={<ClockCircleOutlined className="text-warning" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-card hover:shadow-hover transition-smooth">
            <Statistic
              title="Completed Tasks"
              value={completedTasks}
              prefix={<CheckCircleOutlined className="text-success" />}
              suffix={`/ ${totalTasks}`}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Recent Tasks" className="shadow-card">
            <Table
              dataSource={recentTasks}
              columns={taskColumns}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Department Overview" className="shadow-card">
            <div className="space-y-4">
              {Object.entries(departmentStats).map(([dept, count]) => (
                <div key={dept} className="flex justify-between items-center">
                  <span className="text-foreground font-medium">{dept}</span>
                  <Tag color="blue">{count} employees</Tag>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;

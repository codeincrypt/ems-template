import { Card, Row, Col, Statistic, Select } from 'antd';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ArrowUpOutlined, ArrowDownOutlined, TeamOutlined, UserDeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';
import employeesData from '../data/employees.json';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('6months');

  // Attrition Rate Data
  const attritionData = [
    { month: 'Jan', rate: 8.2, employees: 12 },
    { month: 'Feb', rate: 7.5, employees: 10 },
    { month: 'Mar', rate: 9.1, employees: 15 },
    { month: 'Apr', rate: 6.8, employees: 9 },
    { month: 'May', rate: 7.2, employees: 11 },
    { month: 'Jun', rate: 8.5, employees: 14 },
  ];

  // Recruitment Pipeline Data
  const recruitmentData = [
    { stage: 'Applied', count: 234, percentage: 100 },
    { stage: 'Screening', count: 156, percentage: 67 },
    { stage: 'Interview', count: 89, percentage: 38 },
    { stage: 'Offer', count: 34, percentage: 15 },
    { stage: 'Joined', count: 28, percentage: 12 },
  ];

  // Performance Trends Data
  const performanceData = [
    { quarter: 'Q1 2024', excellent: 45, good: 78, average: 34, needsImprovement: 12 },
    { quarter: 'Q2 2024', excellent: 52, good: 82, average: 28, needsImprovement: 8 },
    { quarter: 'Q3 2024', excellent: 58, good: 85, average: 24, needsImprovement: 6 },
    { quarter: 'Q4 2024', excellent: 62, good: 90, average: 20, needsImprovement: 5 },
  ];

  // Payroll Insights Data
  const payrollData = [
    { month: 'Jan', amount: 8500000 },
    { month: 'Feb', amount: 8650000 },
    { month: 'Mar', amount: 8800000 },
    { month: 'Apr', amount: 9100000 },
    { month: 'May', amount: 9300000 },
    { month: 'Jun', amount: 9500000 },
  ];

  // Department Distribution
  const departmentData = Object.entries(
    employeesData.reduce((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number })
  ).map(([name, value]) => ({ name, value }));

  // Age Distribution
  const ageDistributionData = [
    { range: '20-25', count: 28 },
    { range: '26-30', count: 45 },
    { range: '31-35', count: 38 },
    { range: '36-40', count: 22 },
    { range: '41+', count: 15 },
  ];

  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ];

  const currentAttrition = attritionData[attritionData.length - 1].rate;
  const previousAttrition = attritionData[attritionData.length - 2].rate;
  const attritionTrend = currentAttrition - previousAttrition;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">HR Analytics</h1>
          <p className="text-muted-foreground">Key metrics and insights for decision making</p>
        </div>
        <Select
          value={timeRange}
          onChange={setTimeRange}
          style={{ width: 150 }}
          options={[
            { value: '3months', label: 'Last 3 Months' },
            { value: '6months', label: 'Last 6 Months' },
            { value: '12months', label: 'Last 12 Months' },
          ]}
        />
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-card">
            <Statistic
              title="Current Attrition Rate"
              value={currentAttrition}
              precision={1}
              suffix="%"
              prefix={
                attritionTrend > 0 ? (
                  <ArrowUpOutlined className="text-destructive" />
                ) : (
                  <ArrowDownOutlined className="text-success" />
                )
              }
              valueStyle={{ color: attritionTrend > 0 ? 'hsl(var(--destructive))' : 'hsl(var(--success))' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-card">
            <Statistic
              title="Total Headcount"
              value={employeesData.length}
              prefix={<TeamOutlined className="text-primary" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-card">
            <Statistic
              title="Active Openings"
              value={15}
              suffix="/ 20"
              prefix={<UserDeleteOutlined className="text-accent" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-card">
            <Statistic
              title="Avg. Time to Hire"
              value={28}
              suffix="days"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Attrition Rate Trend" className="shadow-card">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={attritionData}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke="hsl(var(--chart-1))"
                  fillOpacity={1}
                  fill="url(#colorRate)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Department Distribution" className="shadow-card">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Recruitment Pipeline" className="shadow-card">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={recruitmentData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="stage" type="category" stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Performance Distribution" className="shadow-card">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="quarter" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="excellent" stackId="a" fill="hsl(var(--chart-3))" />
                <Bar dataKey="good" stackId="a" fill="hsl(var(--chart-1))" />
                <Bar dataKey="average" stackId="a" fill="hsl(var(--chart-4))" />
                <Bar dataKey="needsImprovement" stackId="a" fill="hsl(var(--chart-5))" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Payroll Trends" className="shadow-card">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={payrollData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => `₹${(value / 100000).toFixed(1)}L`}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--chart-1))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Age Distribution" className="shadow-card">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ageDistributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--chart-5))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;

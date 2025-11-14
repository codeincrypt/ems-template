import { Card, Avatar, Descriptions, Tag, Button, Row, Col, Statistic } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, CalendarOutlined, EditOutlined } from '@ant-design/icons';
import { useAuth } from '@contexts/AuthContext';
import employeesData from '../data/employees.json';

const Profile = () => {
  const { user } = useAuth();
  
  // Get employee data based on logged in user
  const employee = employeesData.find(emp => emp.email === user?.email) || employeesData[0];
  const fullName = `${employee.firstName} ${employee.lastName}`;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">My Profile</h1>
          <p className="text-muted-foreground">View and manage your profile information</p>
        </div>
        <Button type="primary" icon={<EditOutlined />} size="large">
          Edit Profile
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <Card className="text-center shadow-card">
            <Avatar 
              size={120} 
              src={employee.avatar} 
              icon={<UserOutlined />}
              className="mb-4"
            />
            <h2 className="text-xl font-bold text-foreground mb-2">{fullName}</h2>
            <p className="text-muted-foreground mb-2">{employee.designation}</p>
            <Tag color="blue" className="mb-4">{employee.department}</Tag>
            <div className="space-y-2 text-left mt-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MailOutlined />
                <span className="text-sm">{employee.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <PhoneOutlined />
                <span className="text-sm">{employee.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <EnvironmentOutlined />
                <span className="text-sm">{employee.location}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarOutlined />
                <span className="text-sm">Joined {new Date(employee.joiningDate).toLocaleDateString()}</span>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card title="Personal Information" className="shadow-card mb-6">
            <Descriptions column={{ xs: 1, sm: 2 }} bordered>
              <Descriptions.Item label="Full Name">{fullName}</Descriptions.Item>
              <Descriptions.Item label="Employee ID">{employee.id}</Descriptions.Item>
              <Descriptions.Item label="Email">{employee.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{employee.phone}</Descriptions.Item>
              <Descriptions.Item label="Department">{employee.department}</Descriptions.Item>
              <Descriptions.Item label="Designation">{employee.designation}</Descriptions.Item>
              <Descriptions.Item label="Location">{employee.location}</Descriptions.Item>
              <Descriptions.Item label="Joining Date">{new Date(employee.joiningDate).toLocaleDateString()}</Descriptions.Item>
              <Descriptions.Item label="Employment Type">{employee.employmentType}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={employee.status === 'Active' ? 'success' : 'default'}>
                  {employee.status}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Card className="shadow-card">
                <Statistic 
                  title="Leave Balance" 
                  value={15} 
                  suffix="days"
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="shadow-card">
                <Statistic 
                  title="Tasks Assigned" 
                  value={12} 
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="shadow-card">
                <Statistic 
                  title="Performance Score" 
                  value={4.5} 
                  suffix="/ 5"
                  valueStyle={{ color: '#cf1322' }}
                />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
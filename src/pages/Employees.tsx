import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Table, Input, Select, Tag, Avatar, Button, Space, Dropdown } from 'antd';
import { SearchOutlined, PlusOutlined, MailOutlined, PhoneOutlined, EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import employeesData from '../data/employees.json';
import AddEmployeeModal from '../components/AddEmployeeModal';
import { exportToExcel, exportToCSV, formatEmployeeDataForExport } from '@utils/exportUtils';
import { toast } from '@hooks/use-toast';
import { useAuth } from '@contexts/AuthContext';

const { Search } = Input;
const { Option } = Select;

const Employees = () => {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employees, setEmployees] = useState(employeesData);

  useEffect(() => {
    const savedEmployees = localStorage.getItem('employees');
    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees));
    } else {
      localStorage.setItem('employees', JSON.stringify(employeesData));
    }
  }, []);

  const refreshEmployees = () => {
    const savedEmployees = localStorage.getItem('employees');
    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees));
    }
  };

  const departments = Array.from(new Set(employees.map(emp => emp.department)));

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchText.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'all' || emp.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  const handleExport = (format: 'excel' | 'csv') => {
    if (!hasPermission('export_data')) {
      toast({
        title: 'Permission Denied',
        description: 'You do not have permission to export data',
        variant: 'destructive',
      });
      return;
    }

    const exportData = formatEmployeeDataForExport(filteredEmployees.map(emp => ({
      ...emp,
      name: `${emp.firstName} ${emp.lastName}`,
    })));

    if (format === 'excel') {
      exportToExcel(exportData, 'Employees_Report', 'Employees');
    } else {
      exportToCSV(exportData, 'Employees_Report');
    }

    toast({
      title: 'Export Successful',
      description: `Employee data exported to ${format.toUpperCase()}`,
    });
  };

  const exportMenuItems = [
    {
      key: 'excel',
      label: 'Export to Excel',
      onClick: () => handleExport('excel'),
    },
    {
      key: 'csv',
      label: 'Export to CSV',
      onClick: () => handleExport('csv'),
    },
  ];

  const columns = [
    {
      title: 'Employee',
      key: 'employee',
      render: (record: any) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.avatar} size={40} />
          <div>
            <div className="font-semibold text-foreground">
              {record.firstName} {record.lastName}
            </div>
            <div className="text-xs text-muted-foreground">{record.id}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (record: any) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <MailOutlined className="text-muted-foreground" />
            <span className="text-foreground">{record.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <PhoneOutlined className="text-muted-foreground" />
            <span className="text-foreground">{record.phone}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (dept: string) => <Tag color="blue">{dept}</Tag>,
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
      key: 'designation',
      render: (designation: string) => (
        <span className="text-foreground">{designation}</span>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (location: string) => (
        <span className="text-muted-foreground">{location}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Active' ? 'success' : 'default'}>{status}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />}
          onClick={() => navigate(`/employees/${record.id}`)}
        >
          View Profile
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Employees</h1>
          <p className="text-muted-foreground">Manage your workforce</p>
        </div>
        <Space>
          {hasPermission('export_data') && (
            <Dropdown menu={{ items: exportMenuItems }} placement="bottomRight">
              <Button icon={<DownloadOutlined />} size="large">
                Export
              </Button>
            </Dropdown>
          )}
          {hasPermission('edit_employees') && (
            <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => setIsModalOpen(true)}>
              Add Employee
            </Button>
          )}
        </Space>
      </div>

      <Card className="shadow-card">
        <Space direction="vertical" size="large" className="w-full">
          <div className="flex gap-4 flex-wrap">
            <Search
              placeholder="Search by name, email, or ID"
              allowClear
              size="large"
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchText(e.target.value)}
              className="flex-1 min-w-[300px]"
            />
            <Select
              size="large"
              value={selectedDepartment}
              onChange={setSelectedDepartment}
              className="min-w-[200px]"
            >
              <Option value="all">All Departments</Option>
              {departments.map(dept => (
                <Option key={dept} value={dept}>{dept}</Option>
              ))}
            </Select>
          </div>

          <Table
            dataSource={filteredEmployees}
            columns={columns}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showTotal: (total) => `Total ${total} employees`,
            }}
          />
        </Space>
      </Card>

      <AddEmployeeModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={refreshEmployees}
      />
    </div>
  );
};

export default Employees;

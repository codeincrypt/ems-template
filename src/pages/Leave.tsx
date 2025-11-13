import { useState } from 'react';
import { Card, Button, Table, Form, Input, Select, DatePicker, Tag, Row, Col, Statistic, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Calendar } from '@components/ui/calendar';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

interface LeaveApplication {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedOn: string;
}

const Leave = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  // const [selectedCalendarDates, setSelectedCalendarDates] = useState<Date[]>([]);

  const [leaveApplications, setLeaveApplications] = useState<LeaveApplication[]>([
    {
      id: '1',
      employeeId: 'EMP001',
      employeeName: 'John Doe',
      leaveType: 'Casual Leave',
      startDate: '2025-11-15',
      endDate: '2025-11-17',
      days: 3,
      reason: 'Personal work',
      status: 'Approved',
      appliedOn: '2025-11-10',
    },
    {
      id: '2',
      employeeId: 'EMP001',
      employeeName: 'John Doe',
      leaveType: 'Sick Leave',
      startDate: '2025-11-20',
      endDate: '2025-11-20',
      days: 1,
      reason: 'Not feeling well',
      status: 'Pending',
      appliedOn: '2025-11-11',
    },
  ]);

  const leaveBalance = {
    casual: 8,
    sick: 10,
    earned: 15,
    unpaid: 0,
  };

  const handleApplyLeave = () => {
    form.validateFields().then((values) => {
      const startDate = values.dateRange[0];
      const endDate = values.dateRange[1];
      const days = endDate.diff(startDate, 'day') + 1;

      const newApplication: LeaveApplication = {
        id: Date.now().toString(),
        employeeId: 'EMP001',
        employeeName: 'John Doe',
        leaveType: values.leaveType,
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        days,
        reason: values.reason,
        status: 'Pending',
        appliedOn: dayjs().format('YYYY-MM-DD'),
      };

      setLeaveApplications([newApplication, ...leaveApplications]);
      message.success('Leave application submitted successfully!');
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  const columns = [
    {
      title: 'Leave Type',
      dataIndex: 'leaveType',
      key: 'leaveType',
      render: (type: string) => <span className="text-foreground font-medium">{type}</span>,
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'Days',
      dataIndex: 'days',
      key: 'days',
      render: (days: number) => <span className="text-foreground">{days} day{days > 1 ? 's' : ''}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, string> = {
          Pending: 'warning',
          Approved: 'success',
          Rejected: 'error',
        };
        return <Tag color={colors[status]}>{status}</Tag>;
      },
    },
    {
      title: 'Applied On',
      dataIndex: 'appliedOn',
      key: 'appliedOn',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
    },
  ];

  // Mark leave dates on calendar
  const leaveDates = leaveApplications
    .filter(app => app.status === 'Approved')
    .flatMap(app => {
      const dates = [];
      let current = dayjs(app.startDate);
      const end = dayjs(app.endDate);
      while (current.isBefore(end) || current.isSame(end)) {
        dates.push(current.toDate());
        current = current.add(1, 'day');
      }
      return dates;
    });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Leave Management</h1>
          <p className="text-muted-foreground">Apply for leave and track your balance</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => setIsModalOpen(true)}>
          Apply Leave
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-card">
            <Statistic
              title="Casual Leave"
              value={leaveBalance.casual}
              suffix="days"
              valueStyle={{ color: 'hsl(var(--primary))' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-card">
            <Statistic
              title="Sick Leave"
              value={leaveBalance.sick}
              suffix="days"
              valueStyle={{ color: 'hsl(var(--success))' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-card">
            <Statistic
              title="Earned Leave"
              value={leaveBalance.earned}
              suffix="days"
              valueStyle={{ color: 'hsl(var(--accent))' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-card">
            <Statistic
              title="Unpaid Leave"
              value={leaveBalance.unpaid}
              suffix="days"
              valueStyle={{ color: 'hsl(var(--muted-foreground))' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Leave Applications" className="shadow-card">
            <Table
              dataSource={leaveApplications}
              columns={columns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Leave Calendar" className="shadow-card">
            <div className="flex justify-center">
              <Calendar
                mode="multiple"
                selected={leaveDates}
                onSelect={(dates) => console.log(dates as Date[])}
                className="rounded-md border"
              />
            </div>
            <div className="mt-4 p-3 bg-muted/30 rounded-md">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-sm text-foreground">Approved Leaves</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Modal
        title="Apply for Leave"
        open={isModalOpen}
        onOk={handleApplyLeave}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        okText="Submit Application"
        width={600}
      >
        <Form form={form} layout="vertical" className="mt-6">
          <Form.Item
            name="leaveType"
            label="Leave Type"
            rules={[{ required: true, message: 'Please select leave type' }]}
          >
            <Select size="large" placeholder="Select leave type">
              <Option value="Casual Leave">Casual Leave</Option>
              <Option value="Sick Leave">Sick Leave</Option>
              <Option value="Earned Leave">Earned Leave</Option>
              <Option value="Unpaid Leave">Unpaid Leave</Option>
              <Option value="Comp Off">Comp Off</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="Leave Period"
            rules={[{ required: true, message: 'Please select date range' }]}
          >
            <RangePicker size="large" className="w-full" />
          </Form.Item>

          <Form.Item
            name="reason"
            label="Reason"
            rules={[{ required: true, message: 'Please provide reason' }]}
          >
            <TextArea
              rows={4}
              placeholder="Enter reason for leave"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Leave;

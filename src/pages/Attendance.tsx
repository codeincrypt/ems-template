import { useState, useEffect } from 'react';
import { Card, Button, Table, DatePicker, Select, Tag, Space, Statistic, Row, Col, message, Dropdown } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, HomeOutlined, DownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { exportToExcel, exportToCSV, formatAttendanceForExport } from '@utils/exportUtils';
import { toast } from '@hooks/use-toast';
import { useAuth } from '@contexts/AuthContext';
import { sendNotification } from '@components/NotificationCenter';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: 'Present' | 'Absent' | 'WFH' | 'Leave';
  workHours: number;
}

const Attendance = () => {
  const { hasPermission } = useAuth();
  const [todayStatus, setTodayStatus] = useState<string | null>(null);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const [isWFH, setIsWFH] = useState(false);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);

  const loadAttendanceHistory = () => {
    const history = localStorage.getItem('attendance-history');
    if (history) {
      setAttendanceData(JSON.parse(history));
    } else {
      // Mock data
      const mockData: AttendanceRecord[] = [
        {
          id: '1',
          employeeId: 'EMP001',
          employeeName: 'John Doe',
          date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
          checkIn: '09:00 AM',
          checkOut: '06:00 PM',
          status: 'Present',
          workHours: 9,
        },
        {
          id: '2',
          employeeId: 'EMP001',
          employeeName: 'John Doe',
          date: dayjs().subtract(2, 'day').format('YYYY-MM-DD'),
          checkIn: '09:15 AM',
          checkOut: '06:30 PM',
          status: 'WFH',
          workHours: 9.25,
        },
      ];
      setAttendanceData(mockData);
      localStorage.setItem('attendance-history', JSON.stringify(mockData));
    }
  };

  const handleCheckIn = () => {
    const now = dayjs();
    const time = now.format('hh:mm A');
    const today = now.format('YYYY-MM-DD');
    
    setTodayStatus('checked-in');
    setCheckInTime(time);
    
    const status = {
      status: 'checked-in',
      checkIn: time,
      checkOut: null,
      isWFH,
      date: today,
    };
    
    localStorage.setItem(`attendance-${today}`, JSON.stringify(status));
    message.success(`Checked in at ${time}`);
    
    sendNotification({
      title: 'Checked In',
      message: `Successfully checked in at ${time}${isWFH ? ' (WFH)' : ''}`,
      type: 'success',
    });
  };

  const handleCheckOut = () => {
    const now = dayjs();
    const time = now.format('hh:mm A');
    const today = now.format('YYYY-MM-DD');
    
    setTodayStatus('checked-out');
    setCheckOutTime(time);
    
    const status = {
      status: 'checked-out',
      checkIn: checkInTime,
      checkOut: time,
      isWFH,
      date: today,
    };
    
    localStorage.setItem(`attendance-${today}`, JSON.stringify(status));
    
    // Calculate work hours
    const checkInMoment = dayjs(`${today} ${checkInTime}`, 'YYYY-MM-DD hh:mm A');
    const checkOutMoment = dayjs(`${today} ${time}`, 'YYYY-MM-DD hh:mm A');
    const hours = checkOutMoment.diff(checkInMoment, 'hour', true);
    
    // Add to history
    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      employeeId: 'EMP001',
      employeeName: 'John Doe',
      date: today,
      checkIn: checkInTime,
      checkOut: time,
      status: isWFH ? 'WFH' : 'Present',
      workHours: Math.round(hours * 100) / 100,
    };
    
    const history = localStorage.getItem('attendance-history');
    const updatedHistory = history ? [newRecord, ...JSON.parse(history)] : [newRecord];
    localStorage.setItem('attendance-history', JSON.stringify(updatedHistory));
    setAttendanceData(updatedHistory);
    
    message.success(`Checked out at ${time}. Total hours: ${Math.round(hours * 100) / 100}`);
    
    sendNotification({
      title: 'Checked Out',
      message: `Successfully checked out at ${time}. Total hours: ${Math.round(hours * 100) / 100}`,
      type: 'success',
    });
  };

  const toggleWFH = () => {
    setIsWFH(!isWFH);
    message.info(!isWFH ? 'Work from home enabled' : 'Work from office enabled');
  };

  const handleExport = (format: 'excel' | 'csv') => {
    if (!hasPermission('export_data')) {
      toast({
        title: 'Permission Denied',
        description: 'You do not have permission to export data',
        variant: 'destructive',
      });
      return;
    }

    const exportData = formatAttendanceForExport(attendanceData);
    if (format === 'excel') {
      exportToExcel(exportData, 'Attendance_Report', 'Attendance');
    } else {
      exportToCSV(exportData, 'Attendance_Report');
    }

    toast({
      title: 'Export Successful',
      description: `Attendance data exported to ${format.toUpperCase()}`,
    });
  };

  const exportMenuItems = [
    { key: 'excel', label: 'Export to Excel', onClick: () => handleExport('excel') },
    { key: 'csv', label: 'Export to CSV', onClick: () => handleExport('csv') },
  ];

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'Check In',
      dataIndex: 'checkIn',
      key: 'checkIn',
      render: (time: string) => <span className="text-foreground">{time}</span>,
    },
    {
      title: 'Check Out',
      dataIndex: 'checkOut',
      key: 'checkOut',
      render: (time: string) => <span className="text-foreground">{time}</span>,
    },
    {
      title: 'Work Hours',
      dataIndex: 'workHours',
      key: 'workHours',
      render: (hours: number) => <span className="text-foreground">{hours}h</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, string> = {
          Present: 'success',
          WFH: 'processing',
          Absent: 'error',
          Leave: 'warning',
        };
        return <Tag color={colors[status]}>{status}</Tag>;
      },
    },
  ];

  const monthlyStats = {
    present: attendanceData.filter(r => r.status === 'Present').length,
    wfh: attendanceData.filter(r => r.status === 'WFH').length,
    absent: attendanceData.filter(r => r.status === 'Absent').length,
    totalHours: attendanceData.reduce((sum, r) => sum + r.workHours, 0),
  };

  useEffect(() => {
    // Load today's status from localStorage
    const today = dayjs().format('YYYY-MM-DD');
    const savedStatus = localStorage.getItem(`attendance-${today}`);
    if (savedStatus) {
      const status = JSON.parse(savedStatus);
      setTodayStatus(status.status);
      setCheckInTime(status.checkIn);
      setCheckOutTime(status.checkOut);
      setIsWFH(status.isWFH);
    }

    // Load attendance history
    loadAttendanceHistory();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Attendance Tracking</h1>
          <p className="text-muted-foreground">Manage your daily attendance and view reports</p>
        </div>
        {hasPermission('export_data') && (
          <Dropdown menu={{ items: exportMenuItems }} placement="bottomRight">
            <Button icon={<DownloadOutlined />} size="large">
              Export Report
            </Button>
          </Dropdown>
        )}
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Today's Attendance" className="shadow-card">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-foreground">Current Status:</span>
                <Tag color={isWFH ? 'processing' : 'default'} icon={isWFH ? <HomeOutlined /> : null}>
                  {isWFH ? 'Work From Home' : 'Work From Office'}
                </Tag>
              </div>

              {checkInTime && (
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Check In:</span>
                  <span className="font-semibold text-foreground">{checkInTime}</span>
                </div>
              )}

              {checkOutTime && (
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Check Out:</span>
                  <span className="font-semibold text-foreground">{checkOutTime}</span>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                {!todayStatus && (
                  <Button
                    type="primary"
                    icon={<ClockCircleOutlined />}
                    size="large"
                    block
                    onClick={handleCheckIn}
                  >
                    Check In
                  </Button>
                )}

                {todayStatus === 'checked-in' && (
                  <Button
                    type="primary"
                    danger
                    icon={<CheckCircleOutlined />}
                    size="large"
                    block
                    onClick={handleCheckOut}
                  >
                    Check Out
                  </Button>
                )}

                {todayStatus === 'checked-out' && (
                  <Button size="large" block disabled>
                    Attendance Marked
                  </Button>
                )}

                {!todayStatus && (
                  <Button
                    icon={<HomeOutlined />}
                    size="large"
                    onClick={toggleWFH}
                    type={isWFH ? 'primary' : 'default'}
                  >
                    WFH
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Monthly Statistics" className="shadow-card">
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Present Days"
                  value={monthlyStats.present}
                  valueStyle={{ color: 'hsl(var(--success))' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="WFH Days"
                  value={monthlyStats.wfh}
                  valueStyle={{ color: 'hsl(var(--primary))' }}
                />
              </Col>
              <Col span={12} className="mt-4">
                <Statistic
                  title="Total Hours"
                  value={monthlyStats.totalHours}
                  suffix="hrs"
                />
              </Col>
              <Col span={12} className="mt-4">
                <Statistic
                  title="Absent Days"
                  value={monthlyStats.absent}
                  valueStyle={{ color: 'hsl(var(--destructive))' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Card title="Attendance History" className="shadow-card">
        <Space direction="vertical" size="large" className="w-full">
          <div className="flex gap-4 flex-wrap">
            <RangePicker size="large" />
            <Select size="large" defaultValue="all" className="min-w-[150px]">
              <Option value="all">All Status</Option>
              <Option value="present">Present</Option>
              <Option value="wfh">WFH</Option>
              <Option value="absent">Absent</Option>
            </Select>
          </div>

          <Table
            dataSource={attendanceData}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </Space>
      </Card>
    </div>
  );
};

export default Attendance;

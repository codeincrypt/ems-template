import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Tabs, Descriptions, Table, Tag, Button, Avatar, Space, Modal, Empty, Upload, message } from 'antd';
import { ArrowLeftOutlined, EditOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, UploadOutlined, FileOutlined, DownloadOutlined, EyeOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import employeesData from '../data/employees.json';
import EmployeeEditForm from '../components/EmployeeEditForm';

interface DocumentFile {
  key: string;
  documentName: string;
  uploadDate: string;
  status: 'Verified' | 'Pending' | 'Rejected';
  size?: string;
}

const EmployeeProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [documents, setDocuments] = useState<DocumentFile[]>([
    {
      key: '1',
      documentName: 'Offer Letter',
      uploadDate: '2022-01-10',
      status: 'Verified',
      size: '245 KB',
    },
    {
      key: '2',
      documentName: 'ID Proof',
      uploadDate: '2022-01-10',
      status: 'Verified',
      size: '180 KB',
    },
    {
      key: '3',
      documentName: 'Education Certificates',
      uploadDate: '2022-01-10',
      status: 'Verified',
      size: '320 KB',
    }
  ]);
  
  const employee = employeesData.find(emp => emp.id === id);

  if (!employee) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Empty description="Employee not found" />
      </div>
    );
  }

  // Mock data for additional sections
  const employmentHistory = [
    {
      key: '1',
      period: '2022-01 - Present',
      designation: employee.designation,
      department: employee.department,
      type: 'Promotion'
    },
    {
      key: '2',
      period: '2020-06 - 2021-12',
      designation: 'Junior Developer',
      department: 'Engineering',
      type: 'Initial Hire'
    }
  ];

  const assets = [
    {
      key: '1',
      assetType: 'Laptop',
      assetId: 'LAP-001',
      allocatedDate: '2022-01-15',
      status: 'Active'
    },
    {
      key: '2',
      assetType: 'Mobile',
      assetId: 'MOB-045',
      allocatedDate: '2022-01-15',
      status: 'Active'
    },
    {
      key: '3',
      assetType: 'Access Card',
      assetId: 'ACC-234',
      allocatedDate: '2022-01-15',
      status: 'Active'
    }
  ];

  const handleUpload = (file: File) => {
    const newDoc: DocumentFile = {
      key: Date.now().toString(),
      documentName: file.name,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      size: `${(file.size / 1024).toFixed(0)} KB`,
    };
    setDocuments([...documents, newDoc]);
    message.success(`${file.name} uploaded successfully`);
    return false;
  };

  const handleDownload = (doc: DocumentFile) => {
    message.info(`Downloading ${doc.documentName}`);
  };

  const handlePreview = (doc: DocumentFile) => {
    message.info(`Previewing ${doc.documentName}`);
  };

  const updateDocStatus = (docKey: string, status: 'Verified' | 'Rejected') => {
    setDocuments(documents.map(doc => 
      doc.key === docKey ? { ...doc, status } : doc
    ));
    message.success(`Document ${status.toLowerCase()}`);
  };

  const performanceReviews = [
    {
      key: '1',
      period: 'Q4 2023',
      rating: 'Excellent',
      reviewer: employee.reportingManager,
      comments: 'Outstanding performance with exceptional delivery'
    },
    {
      key: '2',
      period: 'Q3 2023',
      rating: 'Good',
      reviewer: employee.reportingManager,
      comments: 'Met all expectations with quality work'
    }
  ];

  const historyColumns = [
    { title: 'Period', dataIndex: 'period', key: 'period' },
    { title: 'Designation', dataIndex: 'designation', key: 'designation' },
    { title: 'Department', dataIndex: 'department', key: 'department' },
    { title: 'Type', dataIndex: 'type', key: 'type', render: (type: string) => <Tag color="blue">{type}</Tag> }
  ];

  const assetColumns = [
    { title: 'Asset Type', dataIndex: 'assetType', key: 'assetType' },
    { title: 'Asset ID', dataIndex: 'assetId', key: 'assetId' },
    { title: 'Allocated Date', dataIndex: 'allocatedDate', key: 'allocatedDate' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status: string) => <Tag color="success">{status}</Tag> }
  ];

  const documentColumns = [
    {
      title: 'Document Name',
      dataIndex: 'documentName',
      key: 'documentName',
      render: (name: string) => (
        <div className="flex items-center gap-2">
          <FileOutlined />
          <span className="text-foreground">{name}</span>
        </div>
      ),
    },
    {
      title: 'Upload Date',
      dataIndex: 'uploadDate',
      key: 'uploadDate',
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, string> = {
          Verified: 'success',
          Pending: 'warning',
          Rejected: 'error',
        };
        return <Tag color={colors[status]}>{status}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: DocumentFile) => (
        <div className="flex gap-2 flex-wrap">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handlePreview(record)}
          >
            Preview
          </Button>
          <Button
            type="link"
            size="small"
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record)}
          >
            Download
          </Button>
          {record.status === 'Pending' && (
            <>
              <Button
                type="link"
                size="small"
                icon={<CheckCircleOutlined />}
                onClick={() => updateDocStatus(record.key, 'Verified')}
              >
                Verify
              </Button>
              <Button
                type="link"
                danger
                size="small"
                icon={<CloseCircleOutlined />}
                onClick={() => updateDocStatus(record.key, 'Rejected')}
              >
                Reject
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  const reviewColumns = [
    { title: 'Period', dataIndex: 'period', key: 'period' },
    { title: 'Rating', dataIndex: 'rating', key: 'rating', render: (rating: string) => <Tag color={rating === 'Excellent' ? 'gold' : 'blue'}>{rating}</Tag> },
    { title: 'Reviewer', dataIndex: 'reviewer', key: 'reviewer' },
    { title: 'Comments', dataIndex: 'comments', key: 'comments' }
  ];

  const tabItems = [
    {
      key: '1',
      label: 'Overview',
      children: (
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Employee ID">{employee.id}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={employee.status === 'Active' ? 'success' : 'default'}>{employee.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Email"><MailOutlined /> {employee.email}</Descriptions.Item>
          <Descriptions.Item label="Phone"><PhoneOutlined /> {employee.phone}</Descriptions.Item>
          <Descriptions.Item label="Department">{employee.department}</Descriptions.Item>
          <Descriptions.Item label="Designation">{employee.designation}</Descriptions.Item>
          <Descriptions.Item label="Reporting Manager">{employee.reportingManager || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Location"><EnvironmentOutlined /> {employee.location}</Descriptions.Item>
          <Descriptions.Item label="Joining Date">{employee.joiningDate}</Descriptions.Item>
          <Descriptions.Item label="Employment Type">{employee.employmentType}</Descriptions.Item>
        </Descriptions>
      )
    },
    {
      key: '2',
      label: 'Employment History',
      children: <Table dataSource={employmentHistory} columns={historyColumns} pagination={false} />
    },
    {
      key: '3',
      label: 'Assets',
      children: <Table dataSource={assets} columns={assetColumns} pagination={false} />
    },
    {
      key: '4',
      label: 'Documents',
      children: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-foreground">Employee Documents</h3>
            <Upload
              beforeUpload={handleUpload}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              showUploadList={false}
            >
              <Button type="primary" icon={<UploadOutlined />}>
                Upload Document
              </Button>
            </Upload>
          </div>
          <Table dataSource={documents} columns={documentColumns} pagination={false} />
        </div>
      )
    },
    {
      key: '5',
      label: 'Performance Reviews',
      children: <Table dataSource={performanceReviews} columns={reviewColumns} pagination={false} />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/employees')}>
            Back
          </Button>
          <div className="flex items-center gap-4">
            <Avatar src={employee.avatar} size={64} />
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">
                {employee.firstName} {employee.lastName}
              </h1>
              <p className="text-muted-foreground">{employee.designation}</p>
            </div>
          </div>
        </Space>
        <Button type="primary" icon={<EditOutlined />} size="large" onClick={() => setIsEditModalOpen(true)}>
          Edit Profile
        </Button>
      </div>

      <Card className="shadow-card">
        <Tabs defaultActiveKey="1" items={tabItems} />
      </Card>

      <Modal
        title="Edit Employee Profile"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
        width={800}
      >
        <EmployeeEditForm employee={employee} onClose={() => setIsEditModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default EmployeeProfile;

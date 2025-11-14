import { Card, Button, Upload, Table, Tag, Space, message, Modal } from 'antd';
import { UploadOutlined, FileOutlined, DownloadOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';
import type { UploadProps } from 'antd';

interface DocumentType {
  id: string;
  name: string;
  type: string;
  category: string;
  uploadDate: string;
  size: string;
  status: 'Verified' | 'Pending' | 'Rejected';
}

const Documents = () => {
  const [documents, setDocuments] = useState<DocumentType[]>([
    {
      id: 'DOC001',
      name: 'Resume_JohnDoe.pdf',
      type: 'PDF',
      category: 'Resume',
      uploadDate: '2025-01-15',
      size: '2.4 MB',
      status: 'Verified',
    },
    {
      id: 'DOC002',
      name: 'Degree_Certificate.pdf',
      type: 'PDF',
      category: 'Education',
      uploadDate: '2025-01-16',
      size: '1.8 MB',
      status: 'Verified',
    },
    {
      id: 'DOC003',
      name: 'Experience_Letter_CompanyA.pdf',
      type: 'PDF',
      category: 'Previous Company',
      uploadDate: '2025-01-17',
      size: '856 KB',
      status: 'Pending',
    },
    {
      id: 'DOC004',
      name: 'PAN_Card.pdf',
      type: 'PDF',
      category: 'Identity',
      uploadDate: '2025-01-18',
      size: '512 KB',
      status: 'Verified',
    },
    {
      id: 'DOC005',
      name: 'Aadhar_Card.pdf',
      type: 'PDF',
      category: 'Identity',
      uploadDate: '2025-01-19',
      size: '624 KB',
      status: 'Verified',
    },
  ]);

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    beforeUpload: (file) => {
      const newDoc: DocumentType = {
        id: `DOC${String(documents.length + 1).padStart(3, '0')}`,
        name: file.name,
        type: file.type.split('/')[1].toUpperCase(),
        category: 'Other',
        uploadDate: new Date().toISOString().split('T')[0],
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        status: 'Pending',
      };
      setDocuments([...documents, newDoc]);
      message.success(`${file.name} uploaded successfully`);
      return false;
    },
  };

  const handleView = (record: DocumentType) => {
    Modal.info({
      title: 'Document Preview',
      content: (
        <div className="space-y-2">
          <p><strong>Name:</strong> {record.name}</p>
          <p><strong>Category:</strong> {record.category}</p>
          <p><strong>Size:</strong> {record.size}</p>
          <p><strong>Upload Date:</strong> {new Date(record.uploadDate).toLocaleDateString()}</p>
        </div>
      ),
      width: 600,
    });
  };

  const handleDownload = (record: DocumentType) => {
    message.success(`Downloading ${record.name}...`);
  };

  const handleDelete = (record: DocumentType) => {
    Modal.confirm({
      title: 'Delete Document',
      content: `Are you sure you want to delete ${record.name}?`,
      okText: 'Delete',
      okType: 'danger',
      onOk: () => {
        setDocuments(documents.filter(doc => doc.id !== record.id));
        message.success('Document deleted successfully');
      },
    });
  };

  const columns = [
    {
      title: 'Document Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <div className="flex items-center gap-2">
          <FileOutlined className="text-primary" />
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <Tag color="blue">{category}</Tag>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Upload Date',
      dataIndex: 'uploadDate',
      key: 'uploadDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors = {
          Verified: 'success',
          Pending: 'warning',
          Rejected: 'error',
        };
        return <Tag color={colors[status as keyof typeof colors]}>{status}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: object, record: DocumentType) => (
        <Space>
          <Button 
            type="link" 
            icon={<EyeOutlined />} 
            onClick={() => handleView(record)}
          >
            View
          </Button>
          <Button 
            type="link" 
            icon={<DownloadOutlined />} 
            onClick={() => handleDownload(record)}
          >
            Download
          </Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const categoryStats = [
    { category: 'Resume', count: documents.filter(d => d.category === 'Resume').length },
    { category: 'Education', count: documents.filter(d => d.category === 'Education').length },
    { category: 'Previous Company', count: documents.filter(d => d.category === 'Previous Company').length },
    { category: 'Identity', count: documents.filter(d => d.category === 'Identity').length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Documents</h1>
          <p className="text-muted-foreground">Upload and manage your documents</p>
        </div>
        <Upload {...uploadProps}>
          <Button type="primary" icon={<UploadOutlined />} size="large">
            Upload Document
          </Button>
        </Upload>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {categoryStats.map(stat => (
          <Card key={stat.category} className="shadow-card">
            <div className="text-center">
              <FileOutlined className="text-3xl text-primary mb-2" />
              <h3 className="text-2xl font-bold text-foreground">{stat.count}</h3>
              <p className="text-sm text-muted-foreground">{stat.category}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="shadow-card">
        <Table 
          columns={columns} 
          dataSource={documents} 
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} documents`,
          }}
        />
      </Card>
    </div>
  );
};

export default Documents;
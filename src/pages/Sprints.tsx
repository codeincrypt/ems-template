import { Card, Button, Table, Tag, Space, Modal, Form, Input, Select, DatePicker, message, Tabs } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserAddOutlined, CommentOutlined, CalendarOutlined } from '@ant-design/icons';
import { useState } from 'react';
import tasksData from '../data/tasks.json';
import employeesData from '../data/employees.json';
import dayjs from 'dayjs';
import { TaskComments } from '@components/TaskComments';
import { TaskCalendar } from '@components/TaskCalendar';

interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'Planning' | 'Active' | 'Completed';
  goals: string;
  taskCount: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  assigneeId: string;
  project: string;
  sprintId?: string;
  dueDate: string;
  dependencies?: string[];
}

const Sprints = () => {
  const [sprints, setSprints] = useState<Sprint[]>([
    {
      id: 'SPR001',
      name: 'Sprint 1 - Core Features',
      startDate: '2025-11-01',
      endDate: '2025-11-15',
      status: 'Completed',
      goals: 'Complete authentication and dashboard',
      taskCount: 5,
    },
    {
      id: 'SPR002',
      name: 'Sprint 2 - UI Enhancement',
      startDate: '2025-11-16',
      endDate: '2025-11-30',
      status: 'Active',
      goals: 'Improve UI/UX across all modules',
      taskCount: 8,
    },
    {
      id: 'SPR003',
      name: 'Sprint 3 - Integration',
      startDate: '2025-12-01',
      endDate: '2025-12-15',
      status: 'Planning',
      goals: 'Integrate payment gateway and email service',
      taskCount: 6,
    },
  ]);

  const [tasks, setTasks] = useState<Task[]>(tasksData.map(t => ({ ...t, sprintId: 'SPR002' })));
  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedSprintForCalendar, setSelectedSprintForCalendar] = useState<Sprint | null>(null);
  const [form] = Form.useForm();
  const [taskForm] = Form.useForm();

  const handleCreateSprint = async (values: any) => {
    const newSprint: Sprint = {
      id: `SPR${String(sprints.length + 1).padStart(3, '0')}`,
      name: values.name,
      startDate: values.dateRange[0].format('YYYY-MM-DD'),
      endDate: values.dateRange[1].format('YYYY-MM-DD'),
      status: 'Planning',
      goals: values.goals,
      taskCount: 0,
    };
    setSprints([...sprints, newSprint]);
    message.success('Sprint created successfully');
    setIsSprintModalOpen(false);
    form.resetFields();
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    taskForm.setFieldsValue({
      ...task,
      dueDate: dayjs(task.dueDate),
    });
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (values: any) => {
    if (editingTask) {
      const updatedTasks = tasks.map(t => 
        t.id === editingTask.id 
          ? { ...t, ...values, dueDate: values.dueDate.format('YYYY-MM-DD') }
          : t
      );
      setTasks(updatedTasks);
      message.success('Task updated successfully');
    } else {
      const employee = employeesData.find(e => e.id === values.assigneeId);
      const newTask: Task = {
        id: `TASK${String(tasks.length + 1).padStart(3, '0')}`,
        title: values.title,
        description: values.description,
        status: values.status,
        priority: values.priority,
        assignee: employee ? `${employee.firstName} ${employee.lastName}` : '',
        assigneeId: values.assigneeId,
        project: values.project,
        sprintId: values.sprintId,
        dueDate: values.dueDate.format('YYYY-MM-DD'),
      };
      setTasks([...tasks, newTask]);
      message.success('Task created successfully');
    }
    setIsTaskModalOpen(false);
    setEditingTask(null);
    taskForm.resetFields();
  };

  const handleAssignPeople = (task: Task) => {
    Modal.confirm({
      title: 'Assign Task',
      content: (
        <Select
          style={{ width: '100%' }}
          placeholder="Select assignee"
          defaultValue={task.assigneeId}
          onChange={(value) => {
            const employee = employeesData.find(e => e.id === value);
            const updatedTasks = tasks.map(t =>
              t.id === task.id
                ? { ...t, assigneeId: value, assignee: employee ? `${employee.firstName} ${employee.lastName}` : '' }
                : t
            );
            setTasks(updatedTasks);
          }}
        >
          {employeesData.map(emp => (
            <Select.Option key={emp.id} value={emp.id}>
              {emp.firstName} {emp.lastName} - {emp.designation}
            </Select.Option>
          ))}
        </Select>
      ),
      onOk: () => {
        message.success('Task assigned successfully');
      },
    });
  };

  const handleViewCalendar = (sprint: Sprint) => {
    setSelectedSprintForCalendar(sprint);
    setIsCalendarModalOpen(true);
  };

  const handleTaskUpdate = (taskId: string, newDueDate: string) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, dueDate: newDueDate } : t
    ));
    message.success('Task due date updated');
  };

  const handleDependencyAdd = (taskId: string, dependsOn: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const dependencies = t.dependencies || [];
        if (!dependencies.includes(dependsOn)) {
          return { ...t, dependencies: [...dependencies, dependsOn] };
        }
      }
      return t;
    }));
  };

  const sprintColumns = [
    {
      title: 'Sprint Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors = {
          Planning: 'default',
          Active: 'processing',
          Completed: 'success',
        };
        return <Tag color={colors[status as keyof typeof colors]}>{status}</Tag>;
      },
    },
    {
      title: 'Tasks',
      dataIndex: 'taskCount',
      key: 'taskCount',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Sprint) => (
        <Space>
          <Button 
            type="link" 
            icon={<CalendarOutlined />}
            onClick={() => handleViewCalendar(record)}
          >
            Timeline
          </Button>
          <Button type="link" icon={<EditOutlined />}>Edit</Button>
          <Button type="link" danger icon={<DeleteOutlined />}>Delete</Button>
        </Space>
      ),
    },
  ];

  const taskColumns = [
    {
      title: 'Task ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, string> = {
          'To Do': 'default',
          'In Progress': 'processing',
          'In Review': 'warning',
          'Done': 'success',
        };
        return <Tag color={colors[status]}>{status}</Tag>;
      },
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => {
        const colors: Record<string, string> = {
          'Low': 'default',
          'Medium': 'warning',
          'High': 'error',
        };
        return <Tag color={colors[priority]}>{priority}</Tag>;
      },
    },
    {
      title: 'Assignee',
      dataIndex: 'assignee',
      key: 'assignee',
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Task) => (
        <Space>
          <Button 
            type="link" 
            icon={<CommentOutlined />}
            onClick={() => {
              setSelectedTaskId(record.id);
              setIsCommentsModalOpen(true);
            }}
          >
            Comments
          </Button>
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEditTask(record)}
          >
            Edit
          </Button>
          <Button 
            type="link" 
            icon={<UserAddOutlined />}
            onClick={() => handleAssignPeople(record)}
          >
            Assign
          </Button>
        </Space>
      ),
    },
  ];

  const tabItems = [
    {
      key: 'sprints',
      label: 'Sprints',
      children: (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => setIsSprintModalOpen(true)}
            >
              Create Sprint
            </Button>
          </div>
          <Card className="shadow-card">
            <Table 
              columns={sprintColumns} 
              dataSource={sprints} 
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </div>
      ),
    },
    {
      key: 'tasks',
      label: 'All Tasks',
      children: (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingTask(null);
                taskForm.resetFields();
                setIsTaskModalOpen(true);
              }}
            >
              Create Task
            </Button>
          </div>
          <Card className="shadow-card">
            <Table 
              columns={taskColumns} 
              dataSource={tasks} 
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Sprint & Task Management</h1>
        <p className="text-muted-foreground">Manage sprints, tasks, and team assignments</p>
      </div>

      <Tabs items={tabItems} defaultActiveKey="sprints" />

      <Modal
        title="Create Sprint"
        open={isSprintModalOpen}
        onCancel={() => setIsSprintModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateSprint}>
          <Form.Item label="Sprint Name" name="name" rules={[{ required: true }]}>
            <Input placeholder="Enter sprint name" />
          </Form.Item>
          <Form.Item label="Date Range" name="dateRange" rules={[{ required: true }]}>
            <DatePicker.RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Goals" name="goals" rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder="Enter sprint goals" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">Create</Button>
              <Button onClick={() => setIsSprintModalOpen(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={editingTask ? 'Edit Task' : 'Create Task'}
        open={isTaskModalOpen}
        onCancel={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
          taskForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={taskForm} layout="vertical" onFinish={handleSaveTask}>
          <Form.Item label="Title" name="title" rules={[{ required: true }]}>
            <Input placeholder="Enter task title" />
          </Form.Item>
          <Form.Item label="Description" name="description" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="Enter task description" />
          </Form.Item>
          <Form.Item label="Sprint" name="sprintId" rules={[{ required: true }]}>
            <Select placeholder="Select sprint">
              {sprints.map(sprint => (
                <Select.Option key={sprint.id} value={sprint.id}>
                  {sprint.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Status" name="status" rules={[{ required: true }]}>
            <Select placeholder="Select status">
              <Select.Option value="To Do">To Do</Select.Option>
              <Select.Option value="In Progress">In Progress</Select.Option>
              <Select.Option value="In Review">In Review</Select.Option>
              <Select.Option value="Done">Done</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Priority" name="priority" rules={[{ required: true }]}>
            <Select placeholder="Select priority">
              <Select.Option value="Low">Low</Select.Option>
              <Select.Option value="Medium">Medium</Select.Option>
              <Select.Option value="High">High</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Assignee" name="assigneeId" rules={[{ required: true }]}>
            <Select placeholder="Select assignee">
              {employeesData.map(emp => (
                <Select.Option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} - {emp.designation}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Project" name="project" rules={[{ required: true }]}>
            <Input placeholder="Enter project name" />
          </Form.Item>
          <Form.Item label="Due Date" name="dueDate" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingTask ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => {
                setIsTaskModalOpen(false);
                setEditingTask(null);
                taskForm.resetFields();
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Task Discussion"
        open={isCommentsModalOpen}
        onCancel={() => {
          setIsCommentsModalOpen(false);
          setSelectedTaskId(null);
        }}
        footer={null}
        width={700}
      >
        {selectedTaskId && <TaskComments taskId={selectedTaskId} />}
      </Modal>

      <Modal
        title={`${selectedSprintForCalendar?.name} - Timeline View`}
        open={isCalendarModalOpen}
        onCancel={() => {
          setIsCalendarModalOpen(false);
          setSelectedSprintForCalendar(null);
        }}
        footer={null}
        width={1200}
      >
        {selectedSprintForCalendar && (
          <TaskCalendar
            tasks={tasks.filter(t => t.sprintId === selectedSprintForCalendar.id)}
            sprintStartDate={selectedSprintForCalendar.startDate}
            sprintEndDate={selectedSprintForCalendar.endDate}
            onTaskUpdate={handleTaskUpdate}
            onDependencyAdd={handleDependencyAdd}
          />
        )}
      </Modal>
    </div>
  );
};

export default Sprints;
import { Card, Tag, Avatar, Tooltip, Modal } from 'antd';
import { ClockCircleOutlined, LinkOutlined } from '@ant-design/icons';
import { useState } from 'react';
import employeesData from '../data/employees.json';
import { dispatchNotification } from '@utils/notification';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  assigneeId: string;
  dueDate: string;
  project: string;
  dependencies?: string[];
}

interface TaskCalendarProps {
  tasks: Task[];
  sprintStartDate: string;
  sprintEndDate: string;
  onTaskUpdate?: (taskId: string, newDueDate: string) => void;
  onDependencyAdd?: (taskId: string, dependsOn: string) => void;
}

export const TaskCalendar = ({ 
  tasks, 
  sprintStartDate, 
  sprintEndDate, 
  onTaskUpdate,
  onDependencyAdd 
}: TaskCalendarProps) => {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [isDependencyModalOpen, setIsDependencyModalOpen] = useState(false);
  const [selectedTaskForDependency, setSelectedTaskForDependency] = useState<Task | null>(null);
  
  const startDate = new Date(sprintStartDate);
  const endDate = new Date(sprintEndDate);
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const getDayPosition = (date: string) => {
    const taskDate = new Date(date);
    const daysFromStart = Math.ceil((taskDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return (daysFromStart / totalDays) * 100;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'To Do': 'bg-gray-200',
      'In Progress': 'bg-blue-200',
      'In Review': 'bg-yellow-200',
      'Done': 'bg-green-200',
    };
    return colors[status] || 'bg-gray-200';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'Low': 'default',
      'Medium': 'warning',
      'High': 'error',
    };
    return colors[priority];
  };

  const getEmployeeAvatar = (assigneeId: string) => {
    const employee = employeesData.find(emp => emp.id === assigneeId);
    return employee?.avatar || '';
  };

  const getEmployeeName = (assigneeId: string) => {
    const employee = employeesData.find(emp => emp.id === assigneeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unassigned';
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dayOffset: number) => {
    e.preventDefault();
    if (!draggedTask) return;

    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() + dayOffset);
    const newDueDate = newDate.toISOString().split('T')[0];

    onTaskUpdate?.(draggedTask.id, newDueDate);
    
    const employee = employeesData.find(emp => emp.id === draggedTask.assigneeId);
    dispatchNotification({
      title: 'Task Rescheduled',
      message: `Task "${draggedTask.title}" has been rescheduled to ${newDate.toLocaleDateString()}`,
      type: 'info',
    });
    
    if (employee) {
      toast.success(`Task rescheduled and ${employee.firstName} ${employee.lastName} has been notified`);
    }
    
    setDraggedTask(null);
  };

  const handleAddDependency = (task: Task) => {
    setSelectedTaskForDependency(task);
    setIsDependencyModalOpen(true);
  };

  const selectDependency = (dependsOnTaskId: string) => {
    if (selectedTaskForDependency) {
      onDependencyAdd?.(selectedTaskForDependency.id, dependsOnTaskId);
      toast.success('Task dependency added');
    }
    setIsDependencyModalOpen(false);
    setSelectedTaskForDependency(null);
  };

  return (
    <Card className="shadow-card" style={{overflowX:"scroll"}}>
      <div className="mb-4">
        <h3 className="font-semibold text-foreground mb-2">Sprint Timeline</h3>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{startDate.toLocaleDateString()}</span>
          <span>{endDate.toLocaleDateString()}</span>
        </div>
      </div>

      <div className="space-y-2">
        {/* Timeline header */}
        <div className="relative h-8 bg-muted rounded">
          <div className="absolute inset-0 flex">
            {Array.from({ length: totalDays + 1 }, (_, i) => {
              const date = new Date(startDate);
              date.setDate(date.getDate() + i);
              return (
                <div
                  key={i}
                  className="flex-1 border-r border-border text-xs text-center pt-1"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, i)}
                >
                  {date.getDate()}
                </div>
              );
            })}
          </div>
        </div>

        {/* Task bars */}
        <div className="space-y-3 mt-4">
          {tasks.map((task) => {
            const position = getDayPosition(task.dueDate);
            const hasDependencies = task.dependencies && task.dependencies.length > 0;
            
            return (
              <div key={task.id} className="relative h-16">
                {hasDependencies && task.dependencies?.map(depId => {
                  const depTask = tasks.find(t => t.id === depId);
                  if (!depTask) return null;
                  
                  const depPosition = getDayPosition(depTask.dueDate);
                  const startX = Math.max(0, depPosition - 15) + 15; // End of dependency task
                  const endX = Math.max(0, position - 15); // Start of current task
                  
                  return (
                    <svg
                      key={depId}
                      className="absolute top-0 left-0 w-full h-full pointer-events-none"
                      style={{ zIndex: -1 }}
                    >
                      <defs>
                        <marker
                          id={`arrowhead-${task.id}-${depId}`}
                          markerWidth="10"
                          markerHeight="10"
                          refX="8"
                          refY="3"
                          orient="auto"
                        >
                          <polygon points="0 0, 10 3, 0 6" fill="hsl(var(--primary))" />
                        </marker>
                      </defs>
                      <line
                        x1={`${startX}%`}
                        y1="50%"
                        x2={`${endX}%`}
                        y2="50%"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        strokeDasharray="4"
                        markerEnd={`url(#arrowhead-${task.id}-${depId})`}
                      />
                    </svg>
                  );
                })}
                
                <Tooltip
                  title={
                    <div>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-xs">Due: {new Date(task.dueDate).toLocaleDateString()}</div>
                      <div className="text-xs">Assignee: {getEmployeeName(task.assigneeId)}</div>
                      {hasDependencies && (
                        <div className="text-xs mt-1">
                          Dependencies: {task.dependencies?.length}
                        </div>
                      )}
                    </div>
                  }
                >
                  <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    className={`absolute h-12 rounded-lg shadow-sm cursor-move hover:shadow-md transition-all ${getStatusColor(task.status)} ${draggedTask?.id === task.id ? 'opacity-50' : ''}`}
                    style={{
                      left: `${Math.max(0, position - 15)}%`,
                      width: '30%',
                      minWidth: '150px',
                    }}
                  >
                    <div className="p-2 h-full flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <div className="font-medium text-sm truncate text-foreground">
                            {task.title}
                          </div>
                          {hasDependencies && (
                            <LinkOutlined className="text-xs text-primary" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Tag color={getPriorityColor(task.priority)} className="text-xs">
                            {task.priority}
                          </Tag>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <ClockCircleOutlined />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddDependency(task);
                          }}
                          className="text-xs px-1 py-0.5 rounded hover:bg-black/10 transition-colors"
                          title="Add dependency"
                        >
                          <LinkOutlined />
                        </button>
                        <Avatar 
                          src={getEmployeeAvatar(task.assigneeId)} 
                          size={24}
                        />
                      </div>
                    </div>
                  </div>
                </Tooltip>
              </div>
            );
          })}
        </div>
        
        <Modal
          title="Add Task Dependency"
          open={isDependencyModalOpen}
          onCancel={() => {
            setIsDependencyModalOpen(false);
            setSelectedTaskForDependency(null);
          }}
          footer={null}
        >
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-4">
              Select which task must be completed before "{selectedTaskForDependency?.title}" can start:
            </p>
            {tasks
              .filter(t => t.id !== selectedTaskForDependency?.id)
              .map(task => (
                <div
                  key={task.id}
                  onClick={() => selectDependency(task.id)}
                  className="p-3 border border-border rounded-lg cursor-pointer hover:bg-accent/10 transition-colors"
                >
                  <div className="font-medium text-sm">{task.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Due: {new Date(task.dueDate).toLocaleDateString()} • {task.status}
                  </div>
                </div>
              ))}
          </div>
        </Modal>
      </div>
    </Card>
  );
};

import { Card, Tag, Avatar, Button } from 'antd';
import { PlusOutlined, ClockCircleOutlined } from '@ant-design/icons';
import tasksData from '../data/tasks.json';
import employeesData from '../data/employees.json';

const Tasks = () => {
  const columns = ['To Do', 'In Progress', 'In Review', 'Done'];
  
  const getTasksByStatus = (status: string) => {
    return tasksData.filter(task => task.status === status);
  };

  const getEmployeeAvatar = (assigneeId: string) => {
    const employee = employeesData.find(emp => emp.id === assigneeId);
    return employee?.avatar || '';
  };

  const getPriorityColor = (priority: string) => {
    const colorMap: { [key: string]: string } = {
      'Low': 'default',
      'Medium': 'warning',
      'High': 'error',
    };
    return colorMap[priority];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Task Board</h1>
          <p className="text-muted-foreground">Manage projects and track progress</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large">
          New Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map(status => {
          const tasks = getTasksByStatus(status);
          return (
            <div key={status} className="flex flex-col">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-foreground">{status}</h3>
                  <Tag className="rounded-full">{tasks.length}</Tag>
                </div>
                <div className="h-1 bg-primary rounded-full" />
              </div>
              
              <div className="space-y-3 flex-1">
                {tasks.map(task => (
                  <Card
                    key={task.id}
                    className="shadow-card hover:shadow-hover transition-smooth cursor-pointer"
                    size="small"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-foreground text-sm leading-tight">
                          {task.title}
                        </h4>
                        <Tag color={getPriorityColor(task.priority)} className="text-xs">
                          {task.priority}
                        </Tag>
                      </div>
                      
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {task.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1">
                        {task.tags.map(tag => (
                          <Tag key={tag} className="text-xs">
                            {tag}
                          </Tag>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <Avatar 
                          src={getEmployeeAvatar(task.assigneeId)} 
                          size={24}
                        />
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <ClockCircleOutlined />
                          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tasks;

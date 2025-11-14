import { useState } from 'react';
import { Card, Button, Avatar, Tag, Mentions } from 'antd';
import { SendOutlined, UserOutlined } from '@ant-design/icons';
import employeesData from '../data/employees.json';
import { dispatchNotification } from '@utils/notification';
import { toast } from 'sonner';

interface Comment {
  id: string;
  author: string;
  authorId: string;
  content: string;
  timestamp: string;
  mentions: string[];
}

interface TaskCommentsProps {
  taskId: string;
  onCommentAdded?: () => void;
}

const isoMinus = (ms: number) => new Date(Date.now() - ms).toISOString();
export const TaskComments = ({ taskId, onCommentAdded }: TaskCommentsProps) => {

  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: 'John Smith',
      authorId: 'EMP001',
      content: 'Started working on this task. @Sarah Johnson please review the requirements.',
      timestamp: isoMinus(3600000),
      mentions: ['EMP002'],
    },
    {
      id: '2',
      author: 'Sarah Johnson',
      authorId: 'EMP002',
      content: 'Looks good! @John Smith proceed with implementation.',
      timestamp: isoMinus(1800000),
      mentions: ['EMP001'],
    },
  ]);
  console.log(taskId)
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const mentionRegex = /@\[([^\]]+)\]\(([^)]+)\)/g;
    const mentions: string[] = [];
    let match;
    
    while ((match = mentionRegex.exec(newComment)) !== null) {
      mentions.push(match[2]);
    }

    const comment: Comment = {
      id: String(comments.length + 1),
      author: 'Current User',
      authorId: 'EMP001',
      content: newComment,
      timestamp: new Date().toISOString(),
      mentions,
    };

    setComments([...comments, comment]);
    
    // Send notifications to mentioned users
    mentions.forEach(mentionId => {
      const employee = employeesData.find(e => e.id === mentionId);
      if (employee) {
        dispatchNotification({
          title: 'You were mentioned',
          message: `${comment.author} mentioned you in a task comment`,
          type: 'info',
        });
        toast.info(`Notification sent to ${employee.firstName} ${employee.lastName}`);
      }
    });
    
    setNewComment('');
    onCommentAdded?.();
  };

  const mentionOptions = employeesData.map(emp => ({
    value: emp.id,
    label: `${emp.firstName} ${emp.lastName}`,
  }));

  return (
    <div className="space-y-4">
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {comments.map((comment) => (
          <Card key={comment.id} size="small" className="shadow-sm">
            <div className="flex gap-3">
              <Avatar icon={<UserOutlined />} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{comment.author}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-foreground">{comment.content}</p>
                {comment.mentions.length > 0 && (
                  <div className="mt-2 flex gap-1">
                    {comment.mentions.map((mentionId) => {
                      const emp = employeesData.find(e => e.id === mentionId);
                      return (
                        <Tag key={mentionId} className="text-xs">
                          @{emp?.firstName} {emp?.lastName}
                        </Tag>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex gap-2">
        <Mentions
          value={newComment}
          onChange={setNewComment}
          style={{ flex: 1 }}
          placeholder="Add a comment... Use @ to mention team members"
          options={mentionOptions}
          rows={2}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleAddComment}
          disabled={!newComment.trim()}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

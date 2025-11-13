import { Card } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

interface ComingSoonProps {
  title: string;
  description: string;
}

const ComingSoon = ({ title, description }: ComingSoonProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <Card className="shadow-card text-center py-12">
        <ClockCircleOutlined className="text-6xl text-primary mb-4" />
        <h2 className="text-2xl font-semibold text-foreground mb-2">Coming Soon</h2>
        <p className="text-muted-foreground">
          This feature is under development and will be available soon.
        </p>
      </Card>
    </div>
  );
};

export default ComingSoon;

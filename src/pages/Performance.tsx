import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Textarea } from '@components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table';
import { Badge } from '@components/ui/badge';
import { Progress } from '@components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@components/ui/dialog';
import { Plus, Target, TrendingUp, Award } from 'lucide-react';
import { toast } from '@hooks/use-toast';

interface Goal {
  id: string;
  employeeId: string;
  employeeName: string;
  title: string;
  description: string;
  type: 'individual' | 'team' | 'company';
  progress: number;
  status: 'on-track' | 'at-risk' | 'completed';
  dueDate: string;
}

interface OKR {
  id: string;
  objective: string;
  keyResults: string[];
  progress: number;
  quarter: string;
  owner: string;
}

interface Review {
  id: string;
  employeeId: string;
  employeeName: string;
  reviewPeriod: string;
  rating: number;
  strengths: string;
  improvements: string;
  status: 'pending' | 'completed' | 'approved';
  reviewDate: string;
}

interface Promotion {
  id: string;
  employeeId: string;
  employeeName: string;
  fromPosition: string;
  toPosition: string;
  effectiveDate: string;
  reason: string;
}

const Performance = () => {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      employeeId: 'E001',
      employeeName: 'John Doe',
      title: 'Complete React Migration',
      description: 'Migrate legacy codebase to React',
      type: 'individual',
      progress: 75,
      status: 'on-track',
      dueDate: '2025-03-31',
    },
    {
      id: '2',
      employeeId: 'E001',
      employeeName: 'John Doe',
      title: 'Improve Code Quality',
      description: 'Reduce technical debt',
      type: 'individual',
      progress: 45,
      status: 'at-risk',
      dueDate: '2025-02-28',
    },
  ]);

  const [okrs] = useState<OKR[]>([
    {
      id: '1',
      objective: 'Increase Customer Satisfaction',
      keyResults: [
        'Achieve NPS score of 80+',
        'Reduce support tickets by 30%',
        'Improve response time to under 2 hours',
      ],
      progress: 65,
      quarter: 'Q1 2025',
      owner: 'Engineering Team',
    },
  ]);

  const [reviews] = useState<Review[]>([
    {
      id: '1',
      employeeId: 'E001',
      employeeName: 'John Doe',
      reviewPeriod: 'Q4 2024',
      rating: 4,
      strengths: 'Strong technical skills, excellent team player',
      improvements: 'Could improve communication with stakeholders',
      status: 'completed',
      reviewDate: '2024-12-15',
    },
  ]);

  const [promotions] = useState<Promotion[]>([
    {
      id: '1',
      employeeId: 'E001',
      employeeName: 'John Doe',
      fromPosition: 'Software Engineer',
      toPosition: 'Senior Software Engineer',
      effectiveDate: '2025-01-01',
      reason: 'Exceptional performance and leadership',
    },
  ]);

  const [newGoal, setNewGoal] = useState({
    employeeId: '',
    employeeName: '',
    title: '',
    description: '',
    type: 'individual' as const,
    dueDate: '',
  });

  const addGoal = () => {
    const goal: Goal = {
      id: Date.now().toString(),
      employeeId: newGoal.employeeId,
      employeeName: newGoal.employeeName,
      title: newGoal.title,
      description: newGoal.description,
      type: newGoal.type,
      progress: 0,
      status: 'on-track',
      dueDate: newGoal.dueDate,
    };
    setGoals([...goals, goal]);
    toast({ title: 'Goal created successfully' });
    setNewGoal({ employeeId: '', employeeName: '', title: '', description: '', type: 'individual', dueDate: '' });
  };

  const updateGoalProgress = (goalId: string, progress: number) => {
    setGoals(
      goals.map((g) =>
        g.id === goalId
          ? {
              ...g,
              progress,
              status: progress === 100 ? 'completed' : progress >= 50 ? 'on-track' : 'at-risk',
            }
          : g
      )
    );
    toast({ title: 'Goal progress updated' });
  };

  const getStatusColor = (status: Goal['status']) => {
    const colors = {
      'on-track': 'default',
      'at-risk': 'destructive',
      completed: 'default',
    };
    return colors[status] as 'default' | 'destructive';
  };

  const getRatingStars = (rating: number) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Performance Management</h1>
          <p className="text-muted-foreground">Track goals, OKRs, reviews, and career progression</p>
        </div>
      </div>

      <Tabs defaultValue="goals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="okrs">OKRs</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Employee Goals</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Set Goal
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create Employee Goal</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Employee ID</Label>
                        <Input
                          value={newGoal.employeeId}
                          onChange={(e) => setNewGoal({ ...newGoal, employeeId: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Employee Name</Label>
                        <Input
                          value={newGoal.employeeName}
                          onChange={(e) => setNewGoal({ ...newGoal, employeeName: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Goal Title</Label>
                      <Input
                        value={newGoal.title}
                        onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={newGoal.description}
                        onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Goal Type</Label>
                        <Input value={newGoal.type} disabled />
                      </div>
                      <div className="space-y-2">
                        <Label>Due Date</Label>
                        <Input
                          type="date"
                          value={newGoal.dueDate}
                          onChange={(e) => setNewGoal({ ...newGoal, dueDate: e.target.value })}
                        />
                      </div>
                    </div>
                    <Button onClick={addGoal}>Create Goal</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Goal</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {goals.map((goal) => (
                    <TableRow key={goal.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-foreground">{goal.employeeName}</div>
                          <div className="text-sm text-muted-foreground">{goal.employeeId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-foreground">{goal.title}</div>
                          <div className="text-sm text-muted-foreground">{goal.description}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground capitalize">{goal.type}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Progress value={goal.progress} className="h-2" />
                          <div className="text-sm text-muted-foreground">{goal.progress}%</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(goal.status)}>
                          {goal.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-foreground">{goal.dueDate}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateGoalProgress(goal.id, Math.min(100, goal.progress + 25))}
                        >
                          <TrendingUp className="h-4 w-4 mr-1" />
                          Update
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="okrs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company OKRs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {okrs.map((okr) => (
                <div key={okr.id} className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-foreground">{okr.objective}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{okr.quarter} • {okr.owner}</p>
                    </div>
                    <Badge>{okr.progress}%</Badge>
                  </div>
                  <Progress value={okr.progress} className="h-2" />
                  <div className="space-y-2 mt-3">
                    <p className="text-sm font-medium text-foreground">Key Results:</p>
                    <ul className="space-y-1">
                      {okr.keyResults.map((kr, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span>{kr}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Review Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-foreground">{review.employeeName}</div>
                          <div className="text-sm text-muted-foreground">{review.employeeId}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground">{review.reviewPeriod}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-foreground">{getRatingStars(review.rating)}</span>
                          <span className="text-sm text-muted-foreground">({review.rating}/5)</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground">{review.reviewDate}</TableCell>
                      <TableCell>
                        <Badge variant={review.status === 'completed' ? 'default' : 'secondary'}>
                          {review.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promotions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Promotion History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>From Position</TableHead>
                    <TableHead>To Position</TableHead>
                    <TableHead>Effective Date</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promotions.map((promotion) => (
                    <TableRow key={promotion.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-foreground">{promotion.employeeName}</div>
                          <div className="text-sm text-muted-foreground">{promotion.employeeId}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground">{promotion.fromPosition}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-success" />
                          <span className="font-medium text-foreground">{promotion.toPosition}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground">{promotion.effectiveDate}</TableCell>
                      <TableCell className="text-muted-foreground">{promotion.reason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Performance;

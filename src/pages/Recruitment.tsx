import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Textarea } from '@components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table';
import { Badge } from '@components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@components/ui/dialog';
import { Plus, Calendar, FileText, CheckCircle, Users } from 'lucide-react';
import { toast } from '@hooks/use-toast';

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  status: 'open' | 'closed';
  applicants: number;
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  appliedDate: string;
}

interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  position: string;
  date: string;
  time: string;
  interviewer: string;
  round: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

const Recruitment = () => {
  const [jobs, setJobs] = useState<JobPosting[]>([
    {
      id: '1',
      title: 'Senior Software Engineer',
      department: 'Engineering',
      location: 'Bangalore',
      type: 'Full-time',
      status: 'open',
      applicants: 24,
    },
    {
      id: '2',
      title: 'HR Manager',
      department: 'Human Resources',
      location: 'Mumbai',
      type: 'Full-time',
      status: 'open',
      applicants: 12,
    },
  ]);

  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+91 9876543210',
      position: 'Senior Software Engineer',
      status: 'interview',
      appliedDate: '2024-12-01',
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.c@email.com',
      phone: '+91 9876543211',
      position: 'Senior Software Engineer',
      status: 'screening',
      appliedDate: '2024-12-05',
    },
  ]);

  const [interviews, setInterviews] = useState<Interview[]>([
    {
      id: '1',
      candidateId: '1',
      candidateName: 'Sarah Johnson',
      position: 'Senior Software Engineer',
      date: '2024-12-20',
      time: '10:00 AM',
      interviewer: 'John Doe',
      round: 'Technical Round 1',
      status: 'scheduled',
    },
  ]);

  const [newJob, setNewJob] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    description: '',
  });

  const addJob = () => {
    const job: JobPosting = {
      id: Date.now().toString(),
      title: newJob.title,
      department: newJob.department,
      location: newJob.location,
      type: newJob.type,
      status: 'open',
      applicants: 0,
    };
    setJobs([...jobs, job]);
    toast({ title: 'Job posting created successfully' });
    setNewJob({ title: '', department: '', location: '', type: 'Full-time', description: '' });
  };

  const updateCandidateStatus = (candidateId: string, status: Candidate['status']) => {
    setCandidates(
      candidates.map((c) => (c.id === candidateId ? { ...c, status } : c))
    );
    toast({ title: 'Candidate status updated' });
  };

  const scheduleInterview = (candidate: Candidate) => {
    const interview: Interview = {
      id: Date.now().toString(),
      candidateId: candidate.id,
      candidateName: candidate.name,
      position: candidate.position,
      date: '2024-12-25',
      time: '2:00 PM',
      interviewer: 'TBD',
      round: 'Initial Screening',
      status: 'scheduled',
    };
    setInterviews([...interviews, interview]);
    updateCandidateStatus(candidate.id, 'interview');
  };

  const generateOfferLetter = (candidate: Candidate) => {
    const offerContent = `
OFFER LETTER

Dear ${candidate.name},

We are pleased to offer you the position of ${candidate.position} at our organization.

Position: ${candidate.position}
Department: Engineering
Location: Office
Start Date: To be confirmed

Please reply to this email to accept this offer.

Best regards,
HR Team
    `;

    const blob = new Blob([offerContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `offer_letter_${candidate.name.replace(' ', '_')}.txt`;
    a.click();
    updateCandidateStatus(candidate.id, 'offer');
    toast({ title: 'Offer letter generated' });
  };

  const getStatusColor = (status: Candidate['status']) => {
    const colors = {
      applied: 'secondary',
      screening: 'default',
      interview: 'default',
      offer: 'default',
      hired: 'default',
      rejected: 'destructive',
    };
    return colors[status] as 'secondary' | 'default' | 'destructive';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Recruitment Management</h1>
          <p className="text-muted-foreground">Manage job postings, candidates, and interviews</p>
        </div>
      </div>

      <Tabs defaultValue="jobs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="jobs">Job Postings</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Active Job Postings</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Post Job
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create Job Posting</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Job Title</Label>
                      <Input
                        value={newJob.title}
                        onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                        placeholder="e.g., Senior Software Engineer"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Department</Label>
                        <Input
                          value={newJob.department}
                          onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          value={newJob.location}
                          onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Job Type</Label>
                      <Select value={newJob.type} onValueChange={(value) => setNewJob({ ...newJob, type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Job Description</Label>
                      <Textarea
                        value={newJob.description}
                        onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                        rows={5}
                      />
                    </div>
                    <Button onClick={addJob}>Create Posting</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Applicants</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium text-foreground">{job.title}</TableCell>
                      <TableCell className="text-foreground">{job.department}</TableCell>
                      <TableCell className="text-foreground">{job.location}</TableCell>
                      <TableCell className="text-foreground">{job.type}</TableCell>
                      <TableCell className="text-foreground">{job.applicants}</TableCell>
                      <TableCell>
                        <Badge variant={job.status === 'open' ? 'default' : 'secondary'}>
                          {job.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="candidates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Candidate Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {candidates.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-foreground">{candidate.name}</div>
                          <div className="text-sm text-muted-foreground">{candidate.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground">{candidate.position}</TableCell>
                      <TableCell className="text-foreground">{candidate.appliedDate}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(candidate.status)}>
                          {candidate.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => scheduleInterview(candidate)}
                          >
                            <Calendar className="h-4 w-4 mr-1" />
                            Schedule
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => generateOfferLetter(candidate)}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Offer
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Interviews</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Interviewer</TableHead>
                    <TableHead>Round</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {interviews.map((interview) => (
                    <TableRow key={interview.id}>
                      <TableCell className="font-medium text-foreground">{interview.candidateName}</TableCell>
                      <TableCell className="text-foreground">{interview.position}</TableCell>
                      <TableCell className="text-foreground">
                        {interview.date} at {interview.time}
                      </TableCell>
                      <TableCell className="text-foreground">{interview.interviewer}</TableCell>
                      <TableCell className="text-foreground">{interview.round}</TableCell>
                      <TableCell>
                        <Badge variant={interview.status === 'scheduled' ? 'default' : 'secondary'}>
                          {interview.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="onboarding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Onboarding Workflow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <div>
                      <div className="font-medium text-foreground">Documentation Complete</div>
                      <div className="text-sm text-muted-foreground">All required documents verified</div>
                    </div>
                  </div>
                  <Badge>Completed</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium text-foreground">Team Introduction</div>
                      <div className="text-sm text-muted-foreground">Meet your team members</div>
                    </div>
                  </div>
                  <Badge variant="secondary">Pending</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium text-foreground">System Access Setup</div>
                      <div className="text-sm text-muted-foreground">Email, tools, and accounts</div>
                    </div>
                  </div>
                  <Badge variant="secondary">Pending</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Recruitment;

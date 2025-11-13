import { toast } from '@hooks/use-toast';
import { sendNotification } from '@components/NotificationCenter';

interface EmailLog {
  id: string;
  to: string;
  subject: string;
  template: string;
  sentAt: string;
  status: 'sent' | 'failed';
}

export const saveEmailLog = (log: Omit<EmailLog, 'id' | 'sentAt' | 'status'>) => {
  const emailLog: EmailLog = {
    id: Date.now().toString(),
    ...log,
    sentAt: new Date().toISOString(),
    status: 'sent',
  };

  const existingLogs = JSON.parse(localStorage.getItem('emailLogs') || '[]');
  localStorage.setItem('emailLogs', JSON.stringify([emailLog, ...existingLogs]));
  
  return emailLog;
};

export const sendOfferLetter = (candidateName: string, email: string, position: string, salary: string, joinDate: string) => {
  const template = `
    <h2>Offer Letter</h2>
    <p>Dear ${candidateName},</p>
    <p>We are pleased to offer you the position of <strong>${position}</strong> at our company.</p>
    <p><strong>Details:</strong></p>
    <ul>
      <li>Position: ${position}</li>
      <li>Annual CTC: ₹${salary}</li>
      <li>Joining Date: ${joinDate}</li>
    </ul>
    <p>Please confirm your acceptance by replying to this email.</p>
    <p>Best regards,<br>HR Team</p>
  `;

  saveEmailLog({
    to: email,
    subject: `Offer Letter - ${position}`,
    template: 'offer_letter',
  });

  toast({
    title: 'Offer Letter Sent',
    description: `Offer letter sent to ${candidateName} at ${email}`,
  });

  sendNotification({
    title: 'Offer Letter Sent',
    message: `Offer letter sent to ${candidateName} for ${position} position`,
    type: 'success',
  });

  return template;
};

export const sendInterviewInvitation = (candidateName: string, email: string, position: string, interviewDate: string, interviewTime: string, interviewType: string) => {
  const template = `
    <h2>Interview Invitation</h2>
    <p>Dear ${candidateName},</p>
    <p>We would like to invite you for an interview for the position of <strong>${position}</strong>.</p>
    <p><strong>Interview Details:</strong></p>
    <ul>
      <li>Date: ${interviewDate}</li>
      <li>Time: ${interviewTime}</li>
      <li>Type: ${interviewType}</li>
    </ul>
    <p>Please confirm your availability.</p>
    <p>Best regards,<br>HR Team</p>
  `;

  saveEmailLog({
    to: email,
    subject: `Interview Invitation - ${position}`,
    template: 'interview_invitation',
  });

  toast({
    title: 'Interview Invitation Sent',
    description: `Interview invitation sent to ${candidateName}`,
  });

  sendNotification({
    title: 'Interview Scheduled',
    message: `Interview scheduled with ${candidateName} on ${interviewDate}`,
    type: 'info',
  });

  return template;
};

export const sendSalarySlip = (employeeName: string, email: string, month: string, netSalary: number) => {
  const template = `
    <h2>Salary Slip - ${month}</h2>
    <p>Dear ${employeeName},</p>
    <p>Please find your salary slip for ${month} below:</p>
    <p><strong>Net Salary: ₹${netSalary.toLocaleString()}</strong></p>
    <p>For detailed breakdown, please check the attached PDF.</p>
    <p>Best regards,<br>Payroll Team</p>
  `;

  saveEmailLog({
    to: email,
    subject: `Salary Slip - ${month}`,
    template: 'salary_slip',
  });

  toast({
    title: 'Salary Slip Sent',
    description: `Salary slip for ${month} sent to ${employeeName}`,
  });

  sendNotification({
    title: 'Salary Slip Generated',
    message: `Your salary slip for ${month} is ready`,
    type: 'info',
  });

  return template;
};

export const sendPerformanceReviewReminder = (employeeName: string, email: string, reviewDate: string) => {
  const template = `
    <h2>Performance Review Reminder</h2>
    <p>Dear ${employeeName},</p>
    <p>This is a reminder that your performance review is scheduled for <strong>${reviewDate}</strong>.</p>
    <p>Please ensure you have completed your self-assessment before the review date.</p>
    <p>Best regards,<br>HR Team</p>
  `;

  saveEmailLog({
    to: email,
    subject: 'Performance Review Reminder',
    template: 'performance_review_reminder',
  });

  toast({
    title: 'Review Reminder Sent',
    description: `Performance review reminder sent to ${employeeName}`,
  });

  sendNotification({
    title: 'Performance Review Upcoming',
    message: `Your performance review is scheduled for ${reviewDate}`,
    type: 'warning',
  });

  return template;
};

export const sendLeaveApprovalNotification = (employeeName: string, email: string, leaveType: string, fromDate: string, toDate: string, status: 'Approved' | 'Rejected') => {
  const template = `
    <h2>Leave Application ${status}</h2>
    <p>Dear ${employeeName},</p>
    <p>Your leave application has been <strong>${status.toLowerCase()}</strong>.</p>
    <p><strong>Details:</strong></p>
    <ul>
      <li>Leave Type: ${leaveType}</li>
      <li>From: ${fromDate}</li>
      <li>To: ${toDate}</li>
    </ul>
    <p>Best regards,<br>HR Team</p>
  `;

  saveEmailLog({
    to: email,
    subject: `Leave Application ${status}`,
    template: 'leave_approval',
  });

  toast({
    title: `Leave ${status}`,
    description: `Leave application ${status.toLowerCase()} for ${employeeName}`,
    variant: status === 'Approved' ? 'default' : 'destructive',
  });

  sendNotification({
    title: `Leave ${status}`,
    message: `Your leave from ${fromDate} to ${toDate} has been ${status.toLowerCase()}`,
    type: status === 'Approved' ? 'success' : 'error',
  });

  return template;
};

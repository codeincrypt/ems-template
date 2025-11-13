import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table';
import { Badge } from '@components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@components/ui/dialog';
import { Download, Plus, Calculator } from 'lucide-react';
import { toast } from '@hooks/use-toast';

interface SalaryStructure {
  id: string;
  employeeId: string;
  employeeName: string;
  basicSalary: number;
  hra: number;
  specialAllowance: number;
  pf: number;
  esi: number;
  tds: number;
  ctc: number;
  netSalary: number;
}

interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  year: number;
  grossSalary: number;
  deductions: number;
  netSalary: number;
  status: 'pending' | 'processed' | 'paid';
}

const Payroll = () => {
  const [salaryStructures, setSalaryStructures] = useState<SalaryStructure[]>([
    {
      id: '1',
      employeeId: 'E001',
      employeeName: 'John Doe',
      basicSalary: 50000,
      hra: 20000,
      specialAllowance: 10000,
      pf: 6000,
      esi: 1500,
      tds: 8000,
      ctc: 960000,
      netSalary: 64500,
    },
  ]);

  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([
    {
      id: '1',
      employeeId: 'E001',
      employeeName: 'John Doe',
      month: 'December',
      year: 2024,
      grossSalary: 80000,
      deductions: 15500,
      netSalary: 64500,
      status: 'paid',
    },
  ]);

  const [newSalary, setNewSalary] = useState({
    employeeId: '',
    employeeName: '',
    basicSalary: '',
    hra: '',
    specialAllowance: '',
  });

  const calculateSalary = () => {
    const basic = parseFloat(newSalary.basicSalary) || 0;
    const hra = parseFloat(newSalary.hra) || 0;
    const special = parseFloat(newSalary.specialAllowance) || 0;
    
    const gross = basic + hra + special;
    const pf = basic * 0.12;
    const esi = gross * 0.0075;
    const tds = gross * 0.1;
    const ctc = gross * 12;
    const netSalary = gross - pf - esi - tds;

    const structure: SalaryStructure = {
      id: Date.now().toString(),
      employeeId: newSalary.employeeId,
      employeeName: newSalary.employeeName,
      basicSalary: basic,
      hra,
      specialAllowance: special,
      pf,
      esi,
      tds,
      ctc,
      netSalary,
    };

    setSalaryStructures([...salaryStructures, structure]);
    toast({ title: 'Salary structure created successfully' });
    setNewSalary({ employeeId: '', employeeName: '', basicSalary: '', hra: '', specialAllowance: '' });
  };

  const generatePayroll = (month: string, year: number) => {
    const newRecords = salaryStructures.map((structure) => ({
      id: Date.now().toString() + structure.id,
      employeeId: structure.employeeId,
      employeeName: structure.employeeName,
      month,
      year,
      grossSalary: structure.basicSalary + structure.hra + structure.specialAllowance,
      deductions: structure.pf + structure.esi + structure.tds,
      netSalary: structure.netSalary,
      status: 'pending' as const,
    }));

    setPayrollRecords([...payrollRecords, ...newRecords]);
    toast({ title: 'Payroll generated successfully' });
  };

  const downloadSalarySlip = (record: PayrollRecord) => {
    const structure = salaryStructures.find((s) => s.employeeId === record.employeeId);
    if (!structure) return;

    const slipContent = `
SALARY SLIP
Employee: ${record.employeeName}
ID: ${record.employeeId}
Month: ${record.month} ${record.year}

EARNINGS:
Basic Salary: ₹${structure.basicSalary}
HRA: ₹${structure.hra}
Special Allowance: ₹${structure.specialAllowance}
Gross Salary: ₹${record.grossSalary}

DEDUCTIONS:
PF: ₹${structure.pf}
ESI: ₹${structure.esi}
TDS: ₹${structure.tds}
Total Deductions: ₹${record.deductions}

NET SALARY: ₹${record.netSalary}
    `;

    const blob = new Blob([slipContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `salary_slip_${record.employeeId}_${record.month}_${record.year}.txt`;
    a.click();
    toast({ title: 'Salary slip downloaded' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payroll Management</h1>
          <p className="text-muted-foreground">Manage salary structures and payroll processing</p>
        </div>
      </div>

      <Tabs defaultValue="structures" className="space-y-4">
        <TabsList>
          <TabsTrigger value="structures">Salary Structures</TabsTrigger>
          <TabsTrigger value="payroll">Monthly Payroll</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="structures" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Salary Structures</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Structure
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create Salary Structure</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Employee ID</Label>
                        <Input
                          value={newSalary.employeeId}
                          onChange={(e) => setNewSalary({ ...newSalary, employeeId: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Employee Name</Label>
                        <Input
                          value={newSalary.employeeName}
                          onChange={(e) => setNewSalary({ ...newSalary, employeeName: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Basic Salary</Label>
                        <Input
                          type="number"
                          value={newSalary.basicSalary}
                          onChange={(e) => setNewSalary({ ...newSalary, basicSalary: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>HRA</Label>
                        <Input
                          type="number"
                          value={newSalary.hra}
                          onChange={(e) => setNewSalary({ ...newSalary, hra: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Special Allowance</Label>
                        <Input
                          type="number"
                          value={newSalary.specialAllowance}
                          onChange={(e) => setNewSalary({ ...newSalary, specialAllowance: e.target.value })}
                        />
                      </div>
                    </div>
                    <Button onClick={calculateSalary}>
                      <Calculator className="mr-2 h-4 w-4" />
                      Calculate & Save
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>CTC</TableHead>
                    <TableHead>Basic</TableHead>
                    <TableHead>HRA</TableHead>
                    <TableHead>PF</TableHead>
                    <TableHead>ESI</TableHead>
                    <TableHead>TDS</TableHead>
                    <TableHead>Net Salary</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salaryStructures.map((structure) => (
                    <TableRow key={structure.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-foreground">{structure.employeeName}</div>
                          <div className="text-sm text-muted-foreground">{structure.employeeId}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">₹{structure.ctc.toLocaleString()}</TableCell>
                      <TableCell className="text-foreground">₹{structure.basicSalary.toLocaleString()}</TableCell>
                      <TableCell className="text-foreground">₹{structure.hra.toLocaleString()}</TableCell>
                      <TableCell className="text-foreground">₹{structure.pf.toLocaleString()}</TableCell>
                      <TableCell className="text-foreground">₹{structure.esi.toLocaleString()}</TableCell>
                      <TableCell className="text-foreground">₹{structure.tds.toLocaleString()}</TableCell>
                      <TableCell className="font-semibold text-success">₹{structure.netSalary.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Monthly Payroll</CardTitle>
              <Button onClick={() => generatePayroll('January', 2025)}>
                Generate Payroll
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Gross Salary</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Net Salary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-foreground">{record.employeeName}</div>
                          <div className="text-sm text-muted-foreground">{record.employeeId}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground">{record.month} {record.year}</TableCell>
                      <TableCell className="text-foreground">₹{record.grossSalary.toLocaleString()}</TableCell>
                      <TableCell className="text-destructive">₹{record.deductions.toLocaleString()}</TableCell>
                      <TableCell className="font-semibold text-success">₹{record.netSalary.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={record.status === 'paid' ? 'default' : 'secondary'}>
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadSalarySlip(record)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Slip
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Total Payroll</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  ₹{payrollRecords.reduce((sum, r) => sum + r.netSalary, 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Total Deductions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">
                  ₹{payrollRecords.reduce((sum, r) => sum + r.deductions, 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Active Employees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{salaryStructures.length}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payroll;

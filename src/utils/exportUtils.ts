import * as XLSX from 'xlsx';

export const exportToExcel = (data: any[], fileName: string, sheetName: string = 'Sheet1') => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const exportToCSV = (data: any[], fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const formatEmployeeDataForExport = (employees: any[]) => {
  return employees.map(emp => ({
    'Employee ID': emp.id,
    'Name': emp.name,
    'Email': emp.email,
    'Phone': emp.phone,
    'Department': emp.department,
    'Designation': emp.designation,
    'Location': emp.location,
    'Status': emp.status,
    'Join Date': emp.joinDate,
  }));
};

export const formatAttendanceForExport = (attendance: any[]) => {
  return attendance.map(record => ({
    'Date': record.date,
    'Employee': record.employeeName,
    'Check In': record.checkIn,
    'Check Out': record.checkOut,
    'Hours': record.hours,
    'Status': record.status,
    'Work Type': record.workType,
  }));
};

export const formatPayrollForExport = (payroll: any[]) => {
  return payroll.map(record => ({
    'Employee': record.employeeName,
    'Month': record.month,
    'Basic Salary': record.basicSalary,
    'HRA': record.hra,
    'Other Allowances': record.otherAllowances,
    'Gross Salary': record.grossSalary,
    'PF Deduction': record.pfDeduction,
    'ESI Deduction': record.esiDeduction,
    'TDS': record.tds,
    'Net Salary': record.netSalary,
  }));
};

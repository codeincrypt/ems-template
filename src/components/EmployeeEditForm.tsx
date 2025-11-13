import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, Input, Select, Button, Space, message } from 'antd';

const { Option } = Select;

const employeeSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(50, 'First name must be less than 50 characters'),
  lastName: z.string().trim().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters'),
  email: z.string().trim().email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  phone: z.string().trim().min(10, 'Phone number must be at least 10 characters').max(20, 'Phone number must be less than 20 characters'),
  department: z.string().min(1, 'Department is required'),
  designation: z.string().trim().min(1, 'Designation is required').max(100, 'Designation must be less than 100 characters'),
  reportingManager: z.string().optional(),
  location: z.string().trim().min(1, 'Location is required').max(100, 'Location must be less than 100 characters'),
  employmentType: z.string().min(1, 'Employment type is required'),
  status: z.string().min(1, 'Status is required'),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  reportingManager: string | null;
  joiningDate: string;
  employmentType: string;
  status: string;
  location: string;
}

interface EmployeeEditFormProps {
  employee: Employee;
  onClose: () => void;
}

const EmployeeEditForm = ({ employee, onClose }: EmployeeEditFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      designation: employee.designation,
      reportingManager: employee.reportingManager || '',
      location: employee.location,
      employmentType: employee.employmentType,
      status: employee.status,
    }
  });

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Form data:', data);
      message.success('Employee profile updated successfully!');
      onClose();
    } catch (error) {
      message.error('Failed to update employee profile');
    }
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-2 gap-4">
        <Form.Item
          label="First Name"
          validateStatus={errors.firstName ? 'error' : ''}
          help={errors.firstName?.message}
        >
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Enter first name" />}
          />
        </Form.Item>

        <Form.Item
          label="Last Name"
          validateStatus={errors.lastName ? 'error' : ''}
          help={errors.lastName?.message}
        >
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Enter last name" />}
          />
        </Form.Item>

        <Form.Item
          label="Email"
          validateStatus={errors.email ? 'error' : ''}
          help={errors.email?.message}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => <Input {...field} type="email" placeholder="Enter email" />}
          />
        </Form.Item>

        <Form.Item
          label="Phone"
          validateStatus={errors.phone ? 'error' : ''}
          help={errors.phone?.message}
        >
          <Controller
            name="phone"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Enter phone number" />}
          />
        </Form.Item>

        <Form.Item
          label="Department"
          validateStatus={errors.department ? 'error' : ''}
          help={errors.department?.message}
        >
          <Controller
            name="department"
            control={control}
            render={({ field }) => (
              <Select {...field} placeholder="Select department">
                <Option value="Engineering">Engineering</Option>
                <Option value="Human Resources">Human Resources</Option>
                <Option value="Marketing">Marketing</Option>
                <Option value="Finance">Finance</Option>
                <Option value="Management">Management</Option>
              </Select>
            )}
          />
        </Form.Item>

        <Form.Item
          label="Designation"
          validateStatus={errors.designation ? 'error' : ''}
          help={errors.designation?.message}
        >
          <Controller
            name="designation"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Enter designation" />}
          />
        </Form.Item>

        <Form.Item
          label="Reporting Manager"
          validateStatus={errors.reportingManager ? 'error' : ''}
          help={errors.reportingManager?.message}
        >
          <Controller
            name="reportingManager"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Enter reporting manager" />}
          />
        </Form.Item>

        <Form.Item
          label="Location"
          validateStatus={errors.location ? 'error' : ''}
          help={errors.location?.message}
        >
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Select {...field} placeholder="Select location">
                <Option value="New York">New York</Option>
                <Option value="San Francisco">San Francisco</Option>
                <Option value="Austin">Austin</Option>
                <Option value="Chicago">Chicago</Option>
                <Option value="Seattle">Seattle</Option>
              </Select>
            )}
          />
        </Form.Item>

        <Form.Item
          label="Employment Type"
          validateStatus={errors.employmentType ? 'error' : ''}
          help={errors.employmentType?.message}
        >
          <Controller
            name="employmentType"
            control={control}
            render={({ field }) => (
              <Select {...field} placeholder="Select employment type">
                <Option value="Full-time">Full-time</Option>
                <Option value="Part-time">Part-time</Option>
                <Option value="Contract">Contract</Option>
                <Option value="Intern">Intern</Option>
              </Select>
            )}
          />
        </Form.Item>

        <Form.Item
          label="Status"
          validateStatus={errors.status ? 'error' : ''}
          help={errors.status?.message}
        >
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select {...field} placeholder="Select status">
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
                <Option value="On Leave">On Leave</Option>
                <Option value="Terminated">Terminated</Option>
              </Select>
            )}
          />
        </Form.Item>
      </div>

      <Form.Item className="mt-6 mb-0">
        <Space className="w-full justify-end">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            Save Changes
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default EmployeeEditForm;

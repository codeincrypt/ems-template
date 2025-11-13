import { Modal, Form, Input, Select, DatePicker, message } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const { Option } = Select;

const employeeSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  department: z.string().min(1, 'Department is required'),
  designation: z.string().min(1, 'Designation is required'),
  reportingManager: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  employmentType: z.string().min(1, 'Employment type is required'),
  joiningDate: z.any(),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface AddEmployeeModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddEmployeeModal = ({ open, onClose, onSuccess }: AddEmployeeModalProps) => {
  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      employmentType: 'Full-time',
    }
  });

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      const employees = JSON.parse(localStorage.getItem('employees') || '[]');
      const newEmployee = {
        id: `EMP${String(employees.length + 1).padStart(3, '0')}`,
        ...data,
        joiningDate: data.joiningDate?.format('YYYY-MM-DD'),
        status: 'Active',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.firstName}`,
      };
      
      employees.push(newEmployee);
      localStorage.setItem('employees', JSON.stringify(employees));
      
      message.success('Employee added successfully!');
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      message.error('Failed to add employee');
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      title="Add New Employee"
      open={open}
      onOk={handleSubmit(onSubmit)}
      onCancel={handleCancel}
      okText="Add Employee"
      cancelText="Cancel"
      confirmLoading={isSubmitting}
      width={800}
    >
      <Form layout="vertical" className="mt-6">
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="First Name"
            validateStatus={errors.firstName ? 'error' : ''}
            help={errors.firstName?.message?.toString()}
            required
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
            help={errors.lastName?.message?.toString()}
            required
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
            help={errors.email?.message?.toString()}
            required
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
            help={errors.phone?.message?.toString()}
            required
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
            help={errors.department?.message?.toString()}
            required
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
            help={errors.designation?.message?.toString()}
            required
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
            help={errors.reportingManager?.message?.toString()}
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
            help={errors.location?.message?.toString()}
            required
          >
            <Controller
              name="location"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Enter location" />}
            />
          </Form.Item>

          <Form.Item
            label="Employment Type"
            validateStatus={errors.employmentType ? 'error' : ''}
            help={errors.employmentType?.message?.toString()}
            required
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
            label="Joining Date"
            validateStatus={errors.joiningDate ? 'error' : ''}
            help={errors.joiningDate?.message?.toString()}
            required
          >
            <Controller
              name="joiningDate"
              control={control}
              render={({ field }) => <DatePicker {...field} className="w-full" />}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default AddEmployeeModal;

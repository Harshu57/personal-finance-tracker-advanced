import React from 'react';
import { Modal, Form, Input, DatePicker, Select, InputNumber, Button } from 'antd';
import { TrophyOutlined, DollarOutlined, CalendarOutlined } from '@ant-design/icons';
import './GoalForm.css';

const { Option } = Select;

const GoalForm = ({ visible, onCancel, onSubmit, initialValues = null }) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then(values => {
      onSubmit({
        ...values,
        deadline: values.deadline.format('YYYY-MM-DD')
      });
      form.resetFields();
    });
  };

  return (
    <Modal
      title={
        <span>
          <TrophyOutlined /> {initialValues ? 'Edit Goal' : 'Create New Goal'}
        </span>
      }
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {initialValues ? 'Update Goal' : 'Create Goal'}
        </Button>
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
      >
        <Form.Item
          name="title"
          label="Goal Title"
          rules={[{ required: true, message: 'Please enter a goal title' }]}
        >
          <Input placeholder="e.g., Emergency Fund, House Down Payment" />
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: 'Please select a category' }]}
        >
          <Select placeholder="Select category">
            <Option value="Savings">Savings</Option>
            <Option value="Investment">Investment</Option>
            <Option value="Debt">Debt Repayment</Option>
            <Option value="Property">Property</Option>
            <Option value="Education">Education</Option>
            <Option value="Retirement">Retirement</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="target"
          label="Target Amount"
          rules={[{ required: true, message: 'Please enter target amount' }]}
        >
          <InputNumber
            prefix={<DollarOutlined />}
            style={{ width: '100%' }}
            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
            placeholder="Enter target amount"
          />
        </Form.Item>

        <Form.Item
          name="current"
          label="Current Progress"
          rules={[{ required: true, message: 'Please enter current progress' }]}
        >
          <InputNumber
            prefix={<DollarOutlined />}
            style={{ width: '100%' }}
            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
            placeholder="Enter current amount saved"
          />
        </Form.Item>

        <Form.Item
          name="deadline"
          label="Target Date"
          rules={[{ required: true, message: 'Please select a target date' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            format="YYYY-MM-DD"
            placeholder="Select target date"
            suffixIcon={<CalendarOutlined />}
          />
        </Form.Item>

        <Form.Item
          name="priority"
          label="Priority Level"
          rules={[{ required: true, message: 'Please select priority level' }]}
        >
          <Select placeholder="Select priority">
            <Option value="High">High</Option>
            <Option value="Medium">Medium</Option>
            <Option value="Low">Low</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea
            placeholder="Add notes or description for your goal"
            rows={4}
          />
        </Form.Item>

        <Form.Item
          name="milestones"
          label="Milestones"
        >
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Add milestone amounts (optional)"
            tokenSeparators={[',']}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default GoalForm; 
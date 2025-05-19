import React, { useState } from 'react';
import { Calendar, Badge, Modal, Form, Input, DatePicker, InputNumber, Select, Button, Card, List } from 'antd';
import {
  DollarOutlined,
  CalendarOutlined,
  BellOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import './BillCalendar.css';

const { Option } = Select;

const BillCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Sample data - replace with real data in production
  const [bills, setBills] = useState([
    {
      id: 1,
      title: 'Rent Payment',
      amount: 1200,
      dueDate: '2024-02-01',
      category: 'Housing',
      status: 'upcoming',
      recurring: 'monthly',
      reminderDays: 3,
    },
    {
      id: 2,
      title: 'Electricity Bill',
      amount: 150,
      dueDate: '2024-02-15',
      category: 'Utilities',
      status: 'upcoming',
      recurring: 'monthly',
      reminderDays: 2,
    },
    {
      id: 3,
      title: 'Car Insurance',
      amount: 200,
      dueDate: '2024-02-10',
      category: 'Insurance',
      status: 'paid',
      recurring: 'monthly',
      reminderDays: 5,
    },
  ]);

  const handleAddBill = (values) => {
    const newBill = {
      id: bills.length + 1,
      ...values,
      dueDate: values.dueDate.format('YYYY-MM-DD'),
      status: 'upcoming',
    };
    setBills([...bills, newBill]);
    setIsModalVisible(false);
    form.resetFields();
  };

  const getListData = (value) => {
    const dateStr = value.format('YYYY-MM-DD');
    return bills.filter(bill => bill.dueDate === dateStr);
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="bill-events">
        {listData.map(item => (
          <li key={item.id}>
            <Badge
              status={item.status === 'paid' ? 'success' : 'warning'}
              text={`${item.title} - $${item.amount}`}
            />
          </li>
        ))}
      </ul>
    );
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const dateStr = date.format('YYYY-MM-DD');
    const dayBills = bills.filter(bill => bill.dueDate === dateStr);
    
    if (dayBills.length > 0) {
      Modal.info({
        title: 'Bills Due',
        content: (
          <List
            dataSource={dayBills}
            renderItem={bill => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    bill.status === 'paid' 
                      ? <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      : <ClockCircleOutlined style={{ color: '#faad14' }} />
                  }
                  title={bill.title}
                  description={`$${bill.amount} - ${bill.category}`}
                />
                {bill.status === 'upcoming' && (
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => markAsPaid(bill.id)}
                  >
                    Mark as Paid
                  </Button>
                )}
              </List.Item>
            )}
          />
        ),
        width: 480,
      });
    }
  };

  const markAsPaid = (billId) => {
    setBills(bills.map(bill => 
      bill.id === billId ? { ...bill, status: 'paid' } : bill
    ));
  };

  return (
    <div className="bill-calendar-container">
      <div className="calendar-header">
        <h2><CalendarOutlined /> Bill Payment Calendar</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Add Bill
        </Button>
      </div>

      <Card className="calendar-card">
        <Calendar
          dateCellRender={dateCellRender}
          onSelect={handleDateSelect}
        />
      </Card>

      <Modal
        title={<span><DollarOutlined /> Add New Bill</span>}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddBill}
        >
          <Form.Item
            name="title"
            label="Bill Title"
            rules={[{ required: true, message: 'Please enter bill title' }]}
          >
            <Input placeholder="e.g., Rent, Utilities, Insurance" />
          </Form.Item>

          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true, message: 'Please enter amount' }]}
          >
            <InputNumber
              prefix={<DollarOutlined />}
              style={{ width: '100%' }}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="dueDate"
            label="Due Date"
            rules={[{ required: true, message: 'Please select due date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select category' }]}
          >
            <Select placeholder="Select category">
              <Option value="Housing">Housing</Option>
              <Option value="Utilities">Utilities</Option>
              <Option value="Insurance">Insurance</Option>
              <Option value="Subscriptions">Subscriptions</Option>
              <Option value="Credit Cards">Credit Cards</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="recurring"
            label="Recurring"
          >
            <Select placeholder="Select recurring pattern">
              <Option value="none">One-time</Option>
              <Option value="weekly">Weekly</Option>
              <Option value="monthly">Monthly</Option>
              <Option value="yearly">Yearly</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="reminderDays"
            label="Reminder"
          >
            <Select placeholder="Select reminder">
              <Option value={1}>1 day before</Option>
              <Option value={3}>3 days before</Option>
              <Option value={5}>5 days before</Option>
              <Option value={7}>1 week before</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Add Bill
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BillCalendar; 
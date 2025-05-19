import React from "react";
import {
  Card,
  Col,
  Row,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  InputNumber,
  Switch,
  Tooltip,
} from "antd";
import {
  DollarOutlined,
  TagOutlined,
  CalendarOutlined,
  UnorderedListOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";

const { Option, OptGroup } = Select;

function AddExpenseModal({
  isExpenseModalVisible,
  handleExpenseCancel,
  onFinish,
}) {
  const [form] = Form.useForm();
  const [isRecurring, setIsRecurring] = React.useState(false);

  const handleFormSubmit = (values) => {
    const recurringData = isRecurring ? {
      isRecurring: true,
      frequency: values.frequency,
      endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : null
    } : {};

    onFinish(
      {
        ...values,
        date: values.date.format("YYYY-MM-DD"),
        amount: parseFloat(values.amount),
        ...recurringData
      },
      "expense"
    );
    form.resetFields();
    setIsRecurring(false);
  };
  
  const handleCancel = () => {
    form.resetFields();
    setIsRecurring(false);
    handleExpenseCancel();
  };

  return (
    <Modal
      style={{ fontWeight: 600 }}
      title="Add Expense"
      visible={isExpenseModalVisible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        initialValues={{
          date: moment(),
          frequency: 'monthly'
        }}
      >
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input the name of the transaction!",
            },
          ]}
        >
          <Input
            type="text"
            className="custom-input"
            placeholder="Enter expense name"
            prefix={<UnorderedListOutlined className="form-icon" />}
          />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Amount"
          name="amount"
          rules={[
            { required: true, message: "Please input the expense amount!" },
          ]}
        >
          <InputNumber
            className="custom-input"
            placeholder="Enter expense amount"
            prefix={<DollarOutlined className="form-icon" />}
            style={{ width: "100%" }}
            formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/₹\s?|(,*)/g, '')}
          />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Date"
          name="date"
          rules={[
            { required: true, message: "Please select the expense date!" },
          ]}
        >
          <DatePicker
            className="custom-input"
            format="YYYY-MM-DD"
            placeholder="Select date"
            prefix={<CalendarOutlined className="form-icon" />}
          />
        </Form.Item>
        <Form.Item
          label="Tag"
          name="tag"
          style={{ fontWeight: 600 }}
          rules={[{ required: true, message: "Please select a tag!" }]}
        >
          <Select
            className="select-input-2"
            showSearch
            placeholder="Select a category"
            optionFilterProp="children"
            prefix={<TagOutlined className="form-icon" />}
          >
            <OptGroup label="Daily Living">
              <Option value="food">Food & Dining</Option>
              <Option value="groceries">Groceries</Option>
              <Option value="transportation">Transportation</Option>
              <Option value="utilities">Utilities</Option>
              <Option value="housing">Housing & Rent</Option>
            </OptGroup>
            
            <OptGroup label="Lifestyle">
              <Option value="entertainment">Entertainment</Option>
              <Option value="shopping">Shopping</Option>
              <Option value="personal">Personal Care</Option>
              <Option value="travel">Travel</Option>
            </OptGroup>
            
            <OptGroup label="Health & Education">
              <Option value="healthcare">Healthcare</Option>
              <Option value="education">Education</Option>
            </OptGroup>
            
            <OptGroup label="Financial & Work">
              <Option value="office">Office Expenses</Option>
              <Option value="taxes">Taxes</Option>
              <Option value="insurance">Insurance</Option>
              <Option value="subscriptions">Subscriptions</Option>
            </OptGroup>
            
            <OptGroup label="Other">
              <Option value="gifts">Gifts & Donations</Option>
              <Option value="other">Other</Option>
            </OptGroup>
          </Select>
        </Form.Item>
        <Form.Item label={
          <span>
            Recurring Expense &nbsp;
            <Tooltip title="Set up expense that repeats automatically">
              <InfoCircleOutlined />
            </Tooltip>
          </span>
        }>
          <Switch
            checked={isRecurring}
            onChange={setIsRecurring}
            checkedChildren={<ReloadOutlined />}
          />
        </Form.Item>
        
        {isRecurring && (
          <>
            <Form.Item
              label="Frequency"
              name="frequency"
              rules={[
                {
                  required: isRecurring,
                  message: "Please select frequency!",
                },
              ]}
            >
              <Select>
                <Option value="weekly">Weekly</Option>
                <Option value="biweekly">Bi-weekly</Option>
                <Option value="monthly">Monthly</Option>
                <Option value="quarterly">Quarterly</Option>
                <Option value="yearly">Yearly</Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              label="End Date (Optional)"
              name="endDate"
            >
              <DatePicker
                style={{ width: "100%" }}
                format="YYYY-MM-DD"
                placeholder="No end date"
                disabledDate={(current) => {
                  const startDate = form.getFieldValue('date');
                  return startDate && current && current < startDate;
                }}
              />
            </Form.Item>
          </>
        )}
        <Form.Item>
          <Button className="btn btn-blue" type="primary" htmlType="submit">
            Add Expense
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddExpenseModal;

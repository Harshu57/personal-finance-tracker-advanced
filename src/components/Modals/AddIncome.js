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

function AddIncomeModal({
  isIncomeModalVisible,
  handleIncomeCancel,
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
      "income"
    );
    form.resetFields();
    setIsRecurring(false);
  };
  
  const handleCancel = () => {
    form.resetFields();
    setIsRecurring(false);
    handleIncomeCancel();
  };

  return (
    <Modal
      style={{ fontWeight: 600 }}
      title="Add Income"
      visible={isIncomeModalVisible}
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
            placeholder="Enter income name"
            prefix={<UnorderedListOutlined className="form-icon" />}
          />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Amount"
          name="amount"
          rules={[
            { required: true, message: "Please input the income amount!" },
          ]}
        >
          <InputNumber
            className="custom-input"
            placeholder="Enter income amount"
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
            { required: true, message: "Please select the income date!" },
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
          style={{ fontWeight: 600 }}
          label="Tag"
          name="tag"
          rules={[{ required: true, message: "Please select a tag!" }]}
        >
          <Select
            className="select-input-2"
            showSearch
            placeholder="Select a category"
            optionFilterProp="children"
            prefix={<TagOutlined className="form-icon" />}
          >
            <OptGroup label="Income Sources">
              <Option value="salary">Salary</Option>
              <Option value="bonus">Bonus</Option>
              <Option value="freelance">Freelance</Option>
              <Option value="business">Business Income</Option>
            </OptGroup>
            <OptGroup label="Investments">
              <Option value="investment">Investment Returns</Option>
              <Option value="dividends">Dividends</Option>
              <Option value="interest">Interest Income</Option>
              <Option value="capital_gains">Capital Gains</Option>
            </OptGroup>
            <OptGroup label="Other Income">
              <Option value="rental">Rental Income</Option>
              <Option value="commission">Commission</Option>
              <Option value="royalties">Royalties</Option>
              <Option value="refund">Refunds</Option>
              <Option value="gift">Gifts</Option>
              <Option value="sale">Sale Proceeds</Option>
              <Option value="other">Other</Option>
            </OptGroup>
          </Select>
        </Form.Item>
        <Form.Item label={
          <span>
            Recurring Income &nbsp;
            <Tooltip title="Set up income that repeats automatically">
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
            Add Income
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddIncomeModal;

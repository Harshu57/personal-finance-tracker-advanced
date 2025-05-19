import React, { useState } from 'react';
import { Card, Row, Col, Typography, Select, Progress, Table, Tag } from 'antd';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  DollarCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import './BudgetAnalytics.css';

const { Title, Text } = Typography;
const { Option } = Select;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const BudgetAnalytics = ({
  monthlyData = [],
  categories = [],
  currentMonth = new Date().toLocaleString('default', { month: 'long' })
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Sample data - replace with real data in production
  const spendingTrends = [
    { month: 'Jan', amount: 3200 },
    { month: 'Feb', amount: 3100 },
    { month: 'Mar', amount: 3400 },
    { month: 'Apr', amount: 3000 },
    { month: 'May', amount: 3500 },
    { month: 'Jun', amount: 3200 },
  ];

  const categorySpending = [
    { name: 'Housing', value: 1200, percentage: 35 },
    { name: 'Food', value: 600, percentage: 18 },
    { name: 'Transportation', value: 400, percentage: 12 },
    { name: 'Utilities', value: 300, percentage: 9 },
    { name: 'Entertainment', value: 200, percentage: 6 },
  ];

  const recentTransactions = [
    {
      key: '1',
      date: '2024-01-15',
      description: 'Grocery Shopping',
      category: 'Food',
      amount: -120.50,
    },
    {
      key: '2',
      date: '2024-01-14',
      description: 'Monthly Rent',
      category: 'Housing',
      amount: -1200.00,
    },
    {
      key: '3',
      date: '2024-01-13',
      description: 'Salary Deposit',
      category: 'Income',
      amount: 5000.00,
    },
  ];

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => (
        <Tag color={category === 'Income' ? 'green' : 'blue'}>{category}</Tag>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => (
        <Text style={{ color: amount >= 0 ? 'var(--success)' : 'var(--danger)' }}>
          ${Math.abs(amount).toFixed(2)}
          {amount >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
        </Text>
      ),
    },
  ];

  return (
    <div className="budget-analytics-container">
      <div className="header-row">
        <Title level={2}>
          <DollarCircleOutlined /> Budget Analytics
        </Title>
        <Select
          defaultValue="month"
          onChange={setSelectedPeriod}
          className="period-selector"
        >
          <Option value="week">This Week</Option>
          <Option value="month">This Month</Option>
          <Option value="quarter">This Quarter</Option>
          <Option value="year">This Year</Option>
        </Select>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card className="spending-trends-card">
            <Title level={4}>Spending Trends</Title>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={spendingTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#1890ff"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card className="category-breakdown-card">
            <Title level={4}>Category Breakdown</Title>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categorySpending}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {categorySpending.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="metrics-row">
        {categorySpending.map((category, index) => (
          <Col xs={24} sm={12} lg={8} xl={6} key={index}>
            <Card className="category-card">
              <Title level={4}>{category.name}</Title>
              <Progress
                percent={category.percentage}
                strokeColor={COLORS[index % COLORS.length]}
                strokeWidth={8}
              />
              <Text className="category-amount">
                ${category.value.toLocaleString()}
              </Text>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="transactions-card">
        <Title level={4}>Recent Transactions</Title>
        <Table
          dataSource={recentTransactions}
          columns={columns}
          pagination={false}
          className="transactions-table"
        />
      </Card>
    </div>
  );
};

export default BudgetAnalytics; 
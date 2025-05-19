import React from "react";
import { Card, Row, Tooltip } from "antd";
import { WalletOutlined, ArrowUpOutlined, ArrowDownOutlined, ReloadOutlined } from "@ant-design/icons";

function Cards({
  currentBalance,
  income,
  expenses,
  showExpenseModal,
  showIncomeModal,
  cardStyle,
  reset,
}) {
  // Format numbers with commas
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const getBalanceColor = () => {
    if (currentBalance > 0) return "var(--success)";
    if (currentBalance < 0) return "var(--danger)";
    return "var(--text-dark)";
  };

  return (
    <Row
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        justifyContent: "space-between",
        padding: "0 2rem",
        marginBottom: "2rem",
      }}
    >
      <Card 
        bordered={false} 
        className="dashboard-card balance-card" 
        style={{
          ...cardStyle,
          borderTop: "5px solid var(--theme)",
        }}
      >
        <div className="card-icon">
          <WalletOutlined />
        </div>
        <h2>Current Balance</h2>
        <p className="card-amount" style={{ color: getBalanceColor() }}>
          {formatMoney(currentBalance)}
        </p>
        <Tooltip title="Reset Balance">
          <div className="btn btn-blue card-button" onClick={reset}>
            <ReloadOutlined /> Reset Balance
          </div>
        </Tooltip>
      </Card>

      <Card 
        bordered={false} 
        className="dashboard-card income-card" 
        style={{
          ...cardStyle,
          borderTop: "5px solid var(--success)",
        }}
      >
        <div className="card-icon income-icon">
          <ArrowUpOutlined />
        </div>
        <h2>Total Income</h2>
        <p className="card-amount" style={{ color: "var(--success)" }}>
          {formatMoney(income)}
        </p>
        <div className="btn btn-blue card-button" onClick={showIncomeModal}>
          <ArrowUpOutlined /> Add Income
        </div>
      </Card>

      <Card 
        bordered={false} 
        className="dashboard-card expense-card" 
        style={{
          ...cardStyle,
          borderTop: "5px solid var(--danger)",
        }}
      >
        <div className="card-icon expense-icon">
          <ArrowDownOutlined />
        </div>
        <h2>Total Expenses</h2>
        <p className="card-amount" style={{ color: "var(--danger)" }}>
          {formatMoney(expenses)}
        </p>
        <div className="btn btn-blue card-button" onClick={showExpenseModal}>
          <ArrowDownOutlined /> Add Expense
        </div>
      </Card>
    </Row>
  );
}

export default Cards;

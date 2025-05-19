import React from "react";
import transactions from "../assets/transactions.svg";
import { Button, Empty } from "antd";
import { PlusCircleOutlined, PlusOutlined } from "@ant-design/icons";

function NoTransactions({ showIncomeModal, showExpenseModal }) {
  return (
    <div className="empty-state-container">
      <div className="empty-state-content">
        <img 
          src={transactions} 
          alt="No Transactions" 
          className="empty-state-image"
        />
        <h3>No Transactions Yet</h3>
        <p>Track your finances by adding your first transaction</p>
        
        <div className="empty-state-actions">
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={showIncomeModal}
            className="empty-state-button income-button"
          >
            Add Income
          </Button>
          <Button 
            type="default"
            icon={<PlusOutlined />} 
            onClick={showExpenseModal}
            className="empty-state-button expense-button"
          >
            Add Expense
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NoTransactions;

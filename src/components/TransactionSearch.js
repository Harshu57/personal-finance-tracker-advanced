import React, { useRef, useState } from "react";
import { Table, Select, Radio, Tag, Tooltip, Button, Empty, Modal } from "antd";
import { 
  SearchOutlined, 
  FileExcelOutlined, 
  FileAddOutlined, 
  FilterOutlined,
  SortAscendingOutlined,
  DeleteOutlined,
  EditOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import search from "../assets/search.svg";
import { parse } from "papaparse";
import { toast } from "react-toastify";
import moment from "moment";

const { Option } = Select;

const TransactionSearch = ({
  transactions,
  exportToCsv,
  addTransaction,
  fetchTransactions,
  deleteTransaction,
  deleteAllTransactions
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const fileInput = useRef();

  function importFromCsv(event) {
    event.preventDefault();
    try {
      parse(event.target.files[0], {
        header: true,
        complete: async function (results) {
          // Now results.data is an array of objects representing your CSV rows
          for (const transaction of results.data) {
            // Write each transaction to Firebase, you can use the addTransaction function here
            console.log("Transactions", transaction);
            const newTransaction = {
              ...transaction,
              amount: parseInt(transaction.amount),
            };
            await addTransaction(newTransaction, true);
          }
        },
      });
      toast.success("All Transactions Added");
      fetchTransactions();
      event.target.files = null;
    } catch (e) {
      toast.error(e.message);
    }
  }

  // Get unique tags from transactions for dropdown
  const uniqueTags = [...new Set(transactions.map(transaction => transaction.tag))];

  // Format amount with currency symbol
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleDeleteTransaction = (transaction) => {
    Modal.confirm({
      title: 'Delete Transaction',
      content: `Are you sure you want to delete "${transaction.name}"?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => deleteTransaction(transaction.id),
    });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "10px",
        }}>
          <div
            style={{
              backgroundColor: record.type === "income" ? "rgba(76, 175, 80, 0.2)" : "rgba(244, 67, 54, 0.2)",
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
            }}
          >
            {record.type === "income" ? <ArrowUpOutlined style={{ color: "var(--success)" }} /> : <ArrowDownOutlined style={{ color: "var(--danger)" }} />}
          </div>
          <span>{text}</span>
        </div>
      )
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag color={type === "income" ? "success" : "error"}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => (
        <span>{moment(date).format("DD MMM, YYYY")}</span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount, record) => (
        <span style={{ 
          color: record.type === "income" ? "var(--success)" : "var(--danger)",
          fontWeight: "500"
        }}>
          {record.type === "income" ? "+" : "-"}{formatMoney(amount)}
        </span>
      ),
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
      render: (tag) => (
        <Tag className={`tag-${tag}`}>{tag}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Tooltip title="Edit">
            <Button 
              icon={<EditOutlined />} 
              size="small" 
              type="text"
              onClick={() => console.log("Edit", record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button 
              icon={<DeleteOutlined />} 
              size="small" 
              type="text" 
              danger
              onClick={() => handleDeleteTransaction(record)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  // Filter transactions by date range
  const getDateFilteredTransactions = (transactions) => {
    if (dateRange === "all") return transactions;
    
    const today = moment().startOf('day');
    const lastWeek = moment().subtract(7, 'days').startOf('day');
    const lastMonth = moment().subtract(30, 'days').startOf('day');
    
    return transactions.filter(transaction => {
      const transactionDate = moment(transaction.date).startOf('day');
      
      if (dateRange === "today") {
        return transactionDate.isSame(today);
      } else if (dateRange === "week") {
        return transactionDate.isSameOrAfter(lastWeek);
      } else if (dateRange === "month") {
        return transactionDate.isSameOrAfter(lastMonth);
      }
      
      return true;
    });
  };

  const filteredTransactions = getDateFilteredTransactions(transactions).filter((transaction) => {
    const searchMatch = searchTerm
      ? transaction.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const tagMatch = selectedTag ? transaction.tag === selectedTag : true;
    const typeMatch = typeFilter ? transaction.type === typeFilter : true;

    return searchMatch && tagMatch && typeMatch;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortKey === "date") {
      return new Date(b.date) - new Date(a.date); // Newest first
    } else if (sortKey === "amount") {
      return b.amount - a.amount;
    } else {
      return 0;
    }
  });

  const dataSource = sortedTransactions.map((transaction, index) => ({
    key: index,
    ...transaction,
  }));

  return (
    <div>
      <div className="search-filter-container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div className="input-flex">
            <SearchOutlined style={{ color: 'var(--text-light)' }} />
            <input
              placeholder="Search by transaction name..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Select
              className="select-input"
              onChange={(value) => setSelectedTag(value)}
              value={selectedTag}
              placeholder="Filter by tag"
              allowClear
              suffixIcon={<FilterOutlined />}
            >
              {uniqueTags.map(tag => (
                <Option key={tag} value={tag}>{tag}</Option>
              ))}
            </Select>
            
            <Select
              className="select-input"
              onChange={(value) => setTypeFilter(value)}
              value={typeFilter}
              placeholder="Transaction type"
              allowClear
            >
              <Option value="">All Types</Option>
              <Option value="income">Income</Option>
              <Option value="expense">Expense</Option>
            </Select>
            
            <Select
              className="select-input"
              onChange={(value) => setDateRange(value)}
              value={dateRange}
              placeholder="Time period"
            >
              <Option value="all">All Time</Option>
              <Option value="today">Today</Option>
              <Option value="week">Last 7 Days</Option>
              <Option value="month">Last 30 Days</Option>
            </Select>
          </div>
        </div>
      </div>

      <div className="my-table">
        <div className="table-header">
          <h2 className="table-title">Transaction History</h2>

          <Radio.Group
            className="input-radio mobile-hidden"
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
          >
            <Radio.Button value=""><SortAscendingOutlined /> No Sort</Radio.Button>
            <Radio.Button value="date">By Date</Radio.Button>
            <Radio.Button value="amount">By Amount</Radio.Button>
          </Radio.Group>
          
          <div className="table-actions">
            <Tooltip title="Export transactions to CSV">
              <button className="btn" onClick={exportToCsv}>
                <FileExcelOutlined /> Export to CSV
              </button>
            </Tooltip>
            
            <Tooltip title="Import transactions from CSV">
              <label htmlFor="file-csv" className="btn btn-blue">
                <FileAddOutlined /> Import from CSV
              </label>
              <input
                onChange={importFromCsv}
                id="file-csv"
                type="file"
                accept=".csv"
                required
                style={{ display: "none" }}
              />
            </Tooltip>
            
            <Tooltip title="Delete all transactions">
              <button className="btn btn-danger" onClick={deleteAllTransactions}>
                <DeleteOutlined /> Delete All
              </button>
            </Tooltip>
          </div>
        </div>

        <Table 
          columns={columns} 
          dataSource={dataSource} 
          pagination={{ 
            pageSize: 8,
            showSizeChanger: false,
            position: ['bottomCenter'],
          }}
          locale={{
            emptyText: <Empty description="No transactions found" />,
          }}
        />
      </div>
    </div>
  );
};

export default TransactionSearch;

import React, { useEffect, useState } from "react";
import { Card, Row, Col, Modal, Tabs, Switch, Badge, notification, Progress, Button, Input, DatePicker, Statistic, Typography } from "antd";
import { Waterfall, Pie, Heatmap, Column, G2, Histogram, Rose, Area, DualAxes } from "@ant-design/charts";
import moment from "moment";
import TransactionSearch from "./TransactionSearch";
import Header from "./Header";
import AddIncomeModal from "./Modals/AddIncome";
import AddExpenseModal from "./Modals/AddExpense";
import AIAssistant from "./AIAssistant";
import Cards from "./Cards";
import NoTransactions from "./NoTransactions";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { addDoc, collection, getDocs, query, deleteDoc, doc } from "firebase/firestore";
import Loader from "./Loader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { unparse } from "papaparse";
import { 
  BulbOutlined, 
  BellOutlined, 
  SettingOutlined, 
  InfoCircleOutlined, 
  FileExcelOutlined,
  PrinterOutlined,
  BulbFilled,
  ThunderboltOutlined,
  RiseOutlined,
  FallOutlined,
  EditOutlined,
  TrophyOutlined,
  PlusOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  DollarOutlined,
  WalletOutlined,
  CreditCardOutlined,
  BankOutlined,
} from "@ant-design/icons";
import jsPDF from "jspdf";
import "jspdf-autotable";
import News from "./News";
import './Dashboard.css';

const { TabPane } = Tabs;
const { Title } = Typography;

const Dashboard = () => {
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(2);
  const [insights, setInsights] = useState([]);
  const [budgetGoals, setBudgetGoals] = useState([
    { category: 'Food', budget: 10000, spent: 6500, id: 1 },
    { category: 'Entertainment', budget: 5000, spent: 4200, id: 2 },
    { category: 'Transportation', budget: 8000, spent: 3600, id: 3 },
    { category: 'Shopping', budget: 6000, spent: 7200, id: 4 }
  ]);

  const navigate = useNavigate();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingInsight, setEditingInsight] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [editGoalModalVisible, setEditGoalModalVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [editGoalCategory, setEditGoalCategory] = useState("");
  const [editGoalBudget, setEditGoalBudget] = useState(0);
  const [editGoalSpent, setEditGoalSpent] = useState(0);

  const processChartData = () => {
    const balanceData = [];
    const spendingData = {};
    const dailyData = [];

    // Get months in order
    const monthsSet = new Set();
    transactions.forEach((transaction) => {
      const monthYear = moment(transaction.date).format("MMM YYYY");
      monthsSet.add(monthYear);
      
      // Process daily data for heatmap
      const day = moment(transaction.date).format("YYYY-MM-DD");
      const existingDay = dailyData.find(d => d.date === day);
      
      if (existingDay) {
        if (transaction.type === 'income') {
          existingDay.value += transaction.amount;
          existingDay.income += transaction.amount;
        } else {
          existingDay.value -= transaction.amount;
          existingDay.expense += transaction.amount;
        }
        existingDay.count += 1;
      } else {
        dailyData.push({
          date: day,
          value: transaction.type === 'income' ? transaction.amount : -transaction.amount,
          income: transaction.type === 'income' ? transaction.amount : 0,
          expense: transaction.type === 'expense' ? transaction.amount : 0,
          count: 1
        });
      }
    });
    
    // Sort months chronologically
    const months = Array.from(monthsSet).sort((a, b) => {
      return moment(a, "MMM YYYY").diff(moment(b, "MMM YYYY"));
    });

    // Initialize balance data for each month with zero values
    months.forEach(monthYear => {
      balanceData.push({ month: monthYear, balance: 0, income: 0, expenses: 0 });
    });

    transactions.forEach((transaction) => {
      const monthYear = moment(transaction.date).format("MMM YYYY");
      const tag = transaction.tag;
      const monthData = balanceData.find(data => data.month === monthYear);

      if (transaction.type === "income") {
        monthData.income += transaction.amount;
        monthData.balance += transaction.amount;
      } else {
        monthData.expenses += transaction.amount;
        monthData.balance -= transaction.amount;

        if (spendingData[tag]) {
          spendingData[tag] += transaction.amount;
        } else {
          spendingData[tag] = transaction.amount;
        }
      }
    });

    // Calculate cumulative balance
    let runningBalance = 0;
    
    balanceData.forEach((data) => {
      // Calculate the running balance for line chart
      runningBalance += data.balance;
      data.cumulativeBalance = runningBalance;
    });

    const spendingDataArray = Object.keys(spendingData).map((key) => ({
      category: key,
      value: spendingData[key],
    }));

    // Sort daily data chronologically
    dailyData.sort((a, b) => moment(a.date).diff(moment(b.date)));

    // Generate column data for stacked column chart
    const columnData = [];
    months.forEach(month => {
      const monthData = balanceData.find(data => data.month === month);
      columnData.push({
        month: month,
        type: 'Income',
        value: monthData.income
      });
      columnData.push({
        month: month,
        type: 'Expenses',
        value: monthData.expenses
      });
      columnData.push({
        month: month,
        type: 'Balance',
        value: monthData.balance
      });
    });

    const areaData = balanceData.map(data => ({
      month: data.month,
      value: data.cumulativeBalance,
      type: 'Cumulative Balance'
    }));

    const mixedChartData = {
      barData: columnData,
      lineData: balanceData.map(data => ({
        month: data.month,
        value: data.cumulativeBalance
      }))
    };

    return { 
      balanceData, 
      spendingDataArray, 
      dailyData,
      columnData,
      areaData,
      mixedChartData
    };
  };

  const { 
    balanceData, 
    spendingDataArray, 
    dailyData,
    columnData,
    areaData,
    mixedChartData
  } = processChartData();
  
  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: moment(values.date).format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };

    setTransactions([...transactions, newTransaction]);
    setIsExpenseModalVisible(false);
    setIsIncomeModalVisible(false);
    addTransaction(newTransaction);
    calculateBalance();
  };

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpenses(expensesTotal);
    setCurrentBalance(incomeTotal - expensesTotal);
  };

  // Calculate the initial balance, income, and expenses
  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  async function addTransaction(transaction, many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      if (!many) {
        toast.success("Transaction Added!");
      }
    } catch (e) {
      console.error("Error adding document: ", e);
      if (!many) {
        toast.error("Couldn't add transaction");
      }
    }
  }

  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((document) => {
        // doc.data() is never undefined for query doc snapshots
        transactionsArray.push({
          ...document.data(),
          id: document.id // Store the document ID for delete operations
        });
      });
      setTransactions(transactionsArray);
      toast.success("Transactions Fetched!");
    }
    setLoading(false);
  }

  async function deleteTransaction(transactionId) {
    try {
      await deleteDoc(doc(db, `users/${user.uid}/transactions`, transactionId));
      // Update local state to remove the deleted transaction
      setTransactions(transactions.filter(transaction => transaction.id !== transactionId));
      toast.success("Transaction deleted successfully!");
      calculateBalance();
    } catch (error) {
      console.error("Error deleting transaction: ", error);
      toast.error("Couldn't delete transaction");
    }
  }

  async function deleteAllTransactions() {
    Modal.confirm({
      title: 'Delete All Transactions',
      content: 'Are you sure you want to delete all your transaction history? This action cannot be undone.',
      okText: 'Yes, Delete All',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        setLoading(true);
        try {
          // Get all transaction documents
          const q = query(collection(db, `users/${user.uid}/transactions`));
          const querySnapshot = await getDocs(q);
          
          // Delete each document
          const deletePromises = [];
          querySnapshot.forEach((document) => {
            deletePromises.push(deleteDoc(doc(db, `users/${user.uid}/transactions`, document.id)));
          });
          
          await Promise.all(deletePromises);
          
          // Update local state
          setTransactions([]);
          setIncome(0);
          setExpenses(0);
          setCurrentBalance(0);
          toast.success("All transactions deleted successfully!");
        } catch (error) {
          console.error("Error deleting all transactions: ", error);
          toast.error("Couldn't delete all transactions");
        }
        setLoading(false);
      }
    });
  }

  // Define colors for the charts
  const chartColors = {
    income: '#4CAF50',
    expense: '#F44336',
    balance: '#0066ff',
    heatmap: ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'],
  };

  // Histogram chart configuration
  const histogramConfig = {
    data: transactions.filter(t => t && typeof t.amount === 'number').map(transaction => ({
      amount: transaction.amount || 0,
      type: transaction.type || 'other',
      month: transaction.date ? moment(transaction.date).format('MMM YYYY') : 'Unknown'
    })),
    binField: 'amount',
    binWidth: transactions.length > 0 ? 1000 : 100,
    stackField: 'type',
    xAxis: {
      title: {
        text: 'Transaction Amount (₹)',
        style: {
          fontSize: 14,
        },
      },
      tickCount: 10,
      label: {
        formatter: (text) => {
          if (!text) return '₹0';
          const value = parseFloat(text);
          return `₹${isNaN(value) ? 0 : value.toLocaleString()}`;
        }
      }
    },
    yAxis: {
      title: {
        text: 'Frequency',
        style: {
          fontSize: 14,
        },
      },
    },
    tooltip: {
      formatter: (datum) => {
        if (!datum || datum.amount === undefined) {
          return { name: 'No data', value: 'No data available' };
        }
        const amount = typeof datum.amount === 'number' ? datum.amount.toLocaleString() : '0';
        return {
          name: `${datum.type === 'income' ? 'Income' : 'Expense'} (₹${amount})`,
          value: `Count: ${datum._bin?.count || 0}`,
        };
      },
    },
    legend: {
      layout: 'horizontal',
      position: 'top',
    },
    color: ({ type }) => {
      if (type === 'income') return chartColors.income;
      if (type === 'expense') return chartColors.expense;
      return '#BAE7FF';
    },
    interactions: [{ type: 'element-highlight' }],
    animation: { appear: { animation: 'fade-in', duration: 1000 } },
    padding: [40, 20, 40, 40],
    height: 400,
    meta: {
      amount: {
        formatter: (value) => {
          if (value === undefined || value === null) return '₹0';
          return `₹${typeof value === 'number' ? value.toLocaleString() : value}`;
        },
      },
    },
  };

  // Calendar heatmap configuration
  const heatmapConfig = {
    data: dailyData,
    xField: 'date',
    yField: 'value',
    colorField: 'value',
    reflect: 'y',
    shape: 'circle',
    pointSize: 10,
    pointStyle: {
      lineWidth: 1,
      fill: '#fff',
      stroke: '#ccc',
    },
    heatmapStyle: {
      padding: 6,
    },
    meta: {
      date: {
        type: 'cat',
        formatter: (date) => moment(date).format('MMM DD'),
      },
      value: {
        formatter: (v) => `₹${v}`,
      },
    },
    coordinate: {
      type: 'calendar',
      calendarConfig: {
        monthSpace: 15,
        cellSize: 25,
      },
    },
    tooltip: {
      formatter: (datum) => {
        if (!datum || !datum.date) {
          return { name: 'No data', value: 'No data available' };
        }
        return {
          name: moment(datum.date).format('MMM DD, YYYY'),
          value: `Income: ₹${datum.income || 0}<br>Expense: ₹${datum.expense || 0}<br>Balance: ₹${datum.value || 0}<br>Transactions: ${datum.count || 0}`,
        };
      },
      showTitle: false,
      domStyles: {
        'g2-tooltip': {
          padding: '12px',
          fontSize: '12px',
        },
      },
    },
    legend: {
      position: 'top',
      itemName: {
        formatter: (text, item) => {
          if (!item || item.value === undefined) return 'Unknown';
          const value = parseFloat(item.value);
          if (value > 0) return 'Income Dominant';
          if (value < 0) return 'Expense Dominant';
          return 'Neutral';
        },
      },
    },
    yAxis: false,
    xAxis: {
      title: {
        text: 'Daily Financial Activity',
      },
    },
    color: ({ value }) => {
      if (value > 0) return chartColors.income;
      if (value < 0) return chartColors.expense;
      return '#ebedf0';
    },
    interactions: [
      { type: 'element-active' },
    ],
    animation: { appear: { animation: 'wave-in', duration: 1000 } },
    height: 300,
  };

  // Stacked column chart configuration
  const columnConfig = {
    data: columnData,
    isGroup: true,
    xField: 'month',
    yField: 'value',
    seriesField: 'type',
    groupField: 'month',
    color: ({ type }) => {
      if (type === 'Income') return chartColors.income;
      if (type === 'Expenses') return chartColors.expense;
      return chartColors.balance;
    },
    columnStyle: {
      radius: [10, 10, 0, 0],
    },
    label: {
      position: 'middle',
      layout: [
        { type: 'interval-adjust-position' },
        { type: 'interval-hide-overlap' },
        { type: 'adjust-color' },
      ],
    },
    legend: {
      position: 'top',
    },
    tooltip: {
      formatter: (datum) => {
        if (!datum || !datum.type) {
          return { name: 'No data', value: 'No data available' };
        }
        return {
          name: datum.type,
          value: `₹${datum[datum.type] || 0}`,
        };
      },
    },
    interactions: [
      { type: 'element-highlight-by-color' },
      { type: 'element-active' },
    ],
    animation: { appear: { animation: 'fade-in', duration: 800 } },
    height: 300,
  };

  const spendingConfig = {
    data: spendingDataArray,
    xField: "category",
    yField: "value",
    seriesField: "category",
    radius: 0.8,
    innerRadius: 0.2,
    width: 1200,
    autoFit: true,
    // Use Nightingale Rose layout
    type: 'sector',
    meta: {
      value: {
        formatter: (value) => {
          if (value === undefined || value === null) return '₹0';
          return `₹${typeof value === 'number' ? value.toLocaleString() : value}`;
        },
      },
    },
    label: {
      offset: -15,
      formatter: (datum) => {
        if (!datum || !datum.category) return '';
        const value = datum.value || 0;
        return `${datum.category}\n₹${typeof value === 'number' ? value.toLocaleString() : value}`;
      },
      style: {
        fontSize: 12,
        textAlign: 'center',
        fontWeight: 'bold',
      },
    },
    tooltip: {
      formatter: (datum) => {
        if (!datum || !datum.category) {
          return { name: 'Category', value: '₹0' };
        }
        const value = datum.value || 0;
        return {
          name: datum.category,
          value: `₹${typeof value === 'number' ? value.toLocaleString() : value}`,
        };
      },
    },
    colorField: "category",
    color: ({ category }) => {
      // Generate consistent colors for categories
      const categoryColors = {
        food: '#FF9800',
        groceries: '#FF7043',
        transportation: '#F57C00',
        utilities: '#9C27B0',
        housing: '#673AB7',
        entertainment: '#FF6D00',
        shopping: '#E91E63',
        healthcare: '#3F51B5',
        education: '#2196F3',
        insurance: '#CDDC39',
        taxes: '#F44336',
        office: '#0066ff',
        gifts: '#8BC34A',
        subscriptions: '#00BCD4',
        travel: '#009688',
        personal: '#4CAF50',
      };
      
      return categoryColors[category] || '#607D8B'; // Default color
    },
    // Nightingale diagram specific configuration
    legend: {
      layout: 'horizontal',
      position: 'bottom',
    },
    animation: {
      appear: {
        animation: 'wave-in',
        duration: 1500,
      },
    },
    interactions: [
      { type: 'element-active' },
      { type: 'legend-highlight' },
    ],
  };

  function reset() {
    toast.info("Balance Reset Feature Coming Soon!");
  }
  
  const cardStyle = {
    boxShadow: "0px 0px 30px 8px rgba(227, 227, 227, 0.75)",
    margin: "2rem",
    borderRadius: "0.5rem",
    minWidth: "300px",
    flex: 1,
  };

  function exportToCsv() {
    const csv = unparse(transactions, {
      fields: ["name", "type", "date", "amount", "tag"],
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Transactions exported successfully!");
  }

  // New function to generate financial insights
  const generateInsights = () => {
    const newInsights = [];
    
    // Only generate insights if we have transactions
    if (transactions.length > 0) {
      // Top spending category
      const expensesByCategory = {};
      transactions.filter(t => t.type === 'expense').forEach(t => {
        expensesByCategory[t.tag] = (expensesByCategory[t.tag] || 0) + t.amount;
      });
      
      const topCategory = Object.keys(expensesByCategory).reduce((a, b) => 
        expensesByCategory[a] > expensesByCategory[b] ? a : b, '');
      
      if (topCategory) {
        newInsights.push({
          id: 1,
          title: 'Top Spending Category',
          description: `Your highest spending is in ${topCategory} (₹${expensesByCategory[topCategory]}).`,
          icon: <FallOutlined style={{ color: 'var(--danger)' }} />
        });
      }
      
      // Monthly income vs expenses
      const thisMonth = moment().format('MMM YYYY');
      const thisMonthIncome = transactions
        .filter(t => t.type === 'income' && moment(t.date).format('MMM YYYY') === thisMonth)
        .reduce((sum, t) => sum + t.amount, 0);
      
      const thisMonthExpenses = transactions
        .filter(t => t.type === 'expense' && moment(t.date).format('MMM YYYY') === thisMonth)
        .reduce((sum, t) => sum + t.amount, 0);
      
      if (thisMonthIncome > 0 || thisMonthExpenses > 0) {
        newInsights.push({
          id: 2,
          title: 'Monthly Overview',
          description: `This month: Income ₹${thisMonthIncome}, Expenses ₹${thisMonthExpenses}, Balance ₹${thisMonthIncome - thisMonthExpenses}`,
          icon: <RiseOutlined style={{ color: thisMonthIncome > thisMonthExpenses ? 'var(--success)' : 'var(--danger)' }} />
        });
      }
      
      // Spending trend
      const lastMonth = moment().subtract(1, 'months').format('MMM YYYY');
      const lastMonthExpenses = transactions
        .filter(t => t.type === 'expense' && moment(t.date).format('MMM YYYY') === lastMonth)
        .reduce((sum, t) => sum + t.amount, 0);
      
      if (thisMonthExpenses > 0 && lastMonthExpenses > 0) {
        const percentChange = (((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100).toFixed(1);
        newInsights.push({
          id: 3,
          title: 'Spending Trend',
          description: `Your spending is ${Math.abs(percentChange)}% ${percentChange > 0 ? 'higher' : 'lower'} than last month.`,
          icon: <ThunderboltOutlined style={{ color: percentChange > 0 ? 'var(--danger)' : 'var(--success)' }} />
        });
      }
      
      // Savings opportunity
      newInsights.push({
        id: 4,
        title: 'Savings Opportunity',
        description: `Consider a systematic savings plan of ₹${Math.round(income * 0.2)} per month (20% of income).`,
        icon: <BulbFilled style={{ color: 'var(--warning)' }} />
      });
    }
    
    setInsights(newInsights);
  };
  
  // Generate insights when transactions change
  useEffect(() => {
    generateInsights();
  }, [transactions]);

  // Toggle dark mode 
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    // Apply dark mode class to body
    if (newDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    toast.info(`${newDarkMode ? 'Dark' : 'Light'} mode enabled`);
  };
  
  // Show notifications
  const openNotifications = () => {
    notification.open({
      message: 'Notifications',
      description: (
        <div>
          <p>🔔 Your Food budget is at 85% of limit</p>
          <p>📅 Monthly report is available for download</p>
        </div>
      ),
      duration: 4,
      placement: 'topRight'
    });
    setNotificationsCount(0);
  };

  // Export PDF report
  const exportPdfReport = () => {
    const doc = new jsPDF();
    // Title
    doc.setFontSize(18);
    doc.text("Personal Finance Report", 14, 16);
    doc.setFontSize(12);
    doc.text(`Generated on: ${moment().format('YYYY-MM-DD HH:mm')}`, 14, 24);
    
    // Summary
    doc.setFontSize(14);
    doc.text("Summary", 14, 36);
    doc.setFontSize(12);
    doc.text(`Current Balance: ₹${currentBalance.toLocaleString()}`, 14, 44);
    doc.text(`Total Income: ₹${income.toLocaleString()}`, 14, 52);
    doc.text(`Total Expenses: ₹${expenses.toLocaleString()}`, 14, 60);

    // Transactions Table
    const tableColumn = ["Name", "Type", "Date", "Amount", "Tag"];
    const tableRows = transactions.map(t => [
      t.name,
      t.type.charAt(0).toUpperCase() + t.type.slice(1),
      moment(t.date).format("YYYY-MM-DD"),
      `₹${t.amount.toLocaleString()}`,
      t.tag
    ]);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 70,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] },
      margin: { left: 14, right: 14 },
      theme: 'striped',
    });

    doc.save("personal-finance-report.pdf");
    toast.success("PDF report generated and downloaded!");
  };

  // Edit handlers for insights
  const openEditInsight = (insight) => {
    setEditingInsight(insight);
    setEditTitle(insight.title);
    setEditDescription(insight.description);
    setEditModalVisible(true);
  };
  const handleEditInsightSave = () => {
    setInsights(insights.map(ins =>
      ins.id === editingInsight.id ? { ...ins, title: editTitle, description: editDescription } : ins
    ));
    setEditModalVisible(false);
    setEditingInsight(null);
  };

  // Edit handlers for budget goals
  const openEditGoal = (goal) => {
    setEditingGoal(goal);
    setEditGoalCategory(goal.category);
    setEditGoalBudget(goal.budget);
    setEditGoalSpent(goal.spent);
    setEditGoalModalVisible(true);
  };
  const handleEditGoalSave = () => {
    setBudgetGoals(budgetGoals.map(g =>
      g.id === editingGoal.id ? { ...g, category: editGoalCategory, budget: Number(editGoalBudget), spent: Number(editGoalSpent) } : g
    ));
    setEditGoalModalVisible(false);
    setEditingGoal(null);
  };

  return (
    <div className={`dashboard-container ${darkMode ? 'dark-mode' : ''}`}>
      <Header />
      {/* News Section */}
      <News />
      {/* App Settings Bar */}
      <div className="settings-bar">
        <div className="settings-actions">
          <div className="dark-mode-toggle">
            <Switch 
              checked={darkMode}
              onChange={toggleDarkMode}
              checkedChildren="🌙"
              unCheckedChildren="☀️"
            />
            <span className="toggle-label">Dark Mode</span>
          </div>
          
          <Button 
            className="settings-button"
            icon={<PrinterOutlined />}
            onClick={exportPdfReport}
          >
            PDF Report
          </Button>
        </div>
        
        <div className="notification-badge">
          <Badge count={notificationsCount} overflowCount={10}>
            <Button 
              type="text" 
              icon={<BellOutlined />} 
              onClick={openNotifications}
              className="notification-button"
              size="large"
            />
          </Badge>
        </div>
      </div>
      
      {loading ? (
        <Loader />
      ) : (
        <>
          <Cards
            currentBalance={currentBalance}
            income={income}
            expenses={expenses}
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
            cardStyle={cardStyle}
            reset={reset}
          />

          <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />
          
          {transactions.length === 0 ? (
            <NoTransactions 
              showIncomeModal={showIncomeModal}
              showExpenseModal={showExpenseModal}
            />
          ) : (
            <>
              {/* Financial Overview Cards */}
              <Row gutter={[16, 16]} className="dashboard-cards">
                <Col xs={24} sm={12} lg={6}>
                  <Card className="dashboard-card">
                    <Statistic
                      title="Total Balance"
                      value={currentBalance}
                      precision={2}
                      prefix={<DollarOutlined />}
                      valueStyle={{ color: '#3f8600' }}
                    />
                    <div className="card-icon">
                      <BankOutlined />
                    </div>
                  </Card>
                </Col>
                
                <Col xs={24} sm={12} lg={6}>
                  <Card className="dashboard-card">
                    <Statistic
                      title="Monthly Income"
                      value={income}
                      precision={2}
                      prefix={<DollarOutlined />}
                      valueStyle={{ color: '#3f8600' }}
                      suffix={<ArrowUpOutlined />}
                    />
                    <div className="card-icon income-icon">
                      <WalletOutlined />
                    </div>
                  </Card>
                </Col>
                
                <Col xs={24} sm={12} lg={6}>
                  <Card className="dashboard-card">
                    <Statistic
                      title="Monthly Expenses"
                      value={expenses}
                      precision={2}
                      prefix={<DollarOutlined />}
                      valueStyle={{ color: '#cf1322' }}
                      suffix={<ArrowDownOutlined />}
                    />
                    <div className="card-icon expense-icon">
                      <CreditCardOutlined />
                    </div>
                  </Card>
                </Col>
                
                <Col xs={24} sm={12} lg={6}>
                  <Card className="dashboard-card">
                    <Statistic
                      title="Monthly Savings"
                      value={income - expenses}
                      precision={2}
                      prefix={<DollarOutlined />}
                      valueStyle={{ color: '#3f8600' }}
                    />
                    <div className="card-icon">
                      <WalletOutlined />
                    </div>
                  </Card>
                </Col>
              </Row>
              
              {/* Budget Progress */}
              <Card className="dashboard-card" style={{ marginTop: '24px' }}>
                <Title level={4}>Monthly Budget Progress</Title>
                <Progress
                  percent={Math.round((expenses / income) * 100)}
                  status="active"
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                />
                <div className="budget-details">
                  <span>Spent: ₹{expenses}</span>
                  <span>Budget: ₹{income}</span>
                </div>
              </Card>

              {/* Recent Transactions */}
              <Card className="dashboard-card" style={{ marginTop: '24px' }}>
                <Title level={4}>Recent Transactions</Title>
                <div className="recent-transactions">
                  {transactions.slice(0, 5).map(transaction => (
                    <div key={transaction.id} className="transaction-item">
                      <div className="transaction-info">
                        <span className="transaction-category">{transaction.name}</span>
                        <span className="transaction-date">{moment(transaction.date).format('DD MMM, YYYY')}</span>
                      </div>
                      <span className={`transaction-amount ${transaction.type}`}>
                        {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}
          <TransactionSearch
            transactions={transactions}
            exportToCsv={exportToCsv}
            fetchTransactions={fetchTransactions}
            addTransaction={addTransaction}
            deleteTransaction={deleteTransaction}
            deleteAllTransactions={deleteAllTransactions}
          />
          <AIAssistant />
        </>
      )}
      <Modal
        open={editModalVisible}
        title="Edit Insight"
        onCancel={() => setEditModalVisible(false)}
        onOk={handleEditInsightSave}
        okText="Save"
        cancelText="Cancel"
      >
        <div style={{ marginBottom: 12 }}>
          <label>Title</label>
          <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
        </div>
        <div>
          <label>Description</label>
          <Input.TextArea rows={3} value={editDescription} onChange={e => setEditDescription(e.target.value)} />
        </div>
      </Modal>
      <Modal
        open={editGoalModalVisible}
        title="Edit Budget Goal"
        onCancel={() => setEditGoalModalVisible(false)}
        onOk={handleEditGoalSave}
        okText="Save"
        cancelText="Cancel"
      >
        <div style={{ marginBottom: 12 }}>
          <label>Category</label>
          <Input value={editGoalCategory} onChange={e => setEditGoalCategory(e.target.value)} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Budget</label>
          <Input type="number" value={editGoalBudget} onChange={e => setEditGoalBudget(e.target.value)} />
        </div>
        <div>
          <label>Spent</label>
          <Input type="number" value={editGoalSpent} onChange={e => setEditGoalSpent(e.target.value)} />
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
